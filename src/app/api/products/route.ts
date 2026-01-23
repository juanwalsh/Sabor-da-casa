import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy, getDoc } from 'firebase/firestore';
import { Product } from '@/types';
import { z } from 'zod';
import { rateLimit, rateLimitConfigs, rateLimitResponse, addRateLimitHeaders } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

// Alterado para 'produtos' para bater com o useFirestoreProducts
const COLLECTION_NAME = 'produtos';

const productSchema = z.object({
  name: z.string().min(1, 'Nome obrigatorio'),
  description: z.string().min(1, 'Descricao obrigatoria'),
  price: z.coerce.number().positive('Preco deve ser positivo'),
  // Removido .url() para aceitar caminhos relativos (/uploads/...)
  image: z.string().min(1, 'Imagem obrigatoria'),
  categoryId: z.string().min(1, 'Categoria obrigatoria'),
  active: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  preparationTime: z.coerce.number().int().nonnegative('Tempo de preparo invalido').optional(),
  serves: z.coerce.number().int().positive('Numero de pessoas invalido').optional(),
  tags: z.array(z.string()).optional().default([]),
  stock: z.coerce.number().int().nonnegative('Estoque invalido').default(100),
});

// Helper para converter de Firestore (PT) para App (EN)
const fromFirestore = (doc: any): Product => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.nome || '',
    description: data.descricao || '',
    price: data.preco || 0,
    image: data.imagem || '',
    categoryId: data.categoriaId || '',
    active: data.ativo ?? true,
    featured: data.destaque ?? false,
    preparationTime: data.tempoPreparo,
    serves: data.porcoes,
    tags: data.tags || [],
    stock: data.estoque || 0,
    // emoji: data.emoji // Se necessario
  };
};

// Helper para converter de App (EN) para Firestore (PT)
const toFirestore = (data: z.infer<typeof productSchema>) => {
  const doc: Record<string, unknown> = {
    nome: data.name,
    descricao: data.description,
    preco: data.price,
    imagem: data.image,
    categoriaId: data.categoryId,
    ativo: data.active,
    destaque: data.featured,
    tags: data.tags || [],
    estoque: data.stock ?? 100,
    updatedAt: new Date().toISOString(),
  };
  if (data.preparationTime !== undefined) doc.tempoPreparo = data.preparationTime;
  if (data.serves !== undefined) doc.porcoes = data.serves;
  return doc;
};

// GET - Lista todos os produtos
export async function GET(request: NextRequest) {
  const rateLimitResult = await rateLimit(request, rateLimitConfigs.public);
  if (!rateLimitResult.success) return rateLimitResponse(rateLimitResult);

  try {
    const productsRef = collection(db, COLLECTION_NAME);
    const q = query(productsRef);
    const snapshot = await getDocs(q);
    
    const products = snapshot.docs.map(fromFirestore);

    const response = NextResponse.json({ success: true, products });
    return addRateLimitHeaders(response, rateLimitResult);
  } catch (error) {
    logger.error('Failed to fetch products', error as Error);
    return NextResponse.json({ success: false, error: 'Erro ao buscar produtos' }, { status: 500 });
  }
}

// POST - Cria novo produto
export async function POST(request: NextRequest) {
  const rateLimitResult = await rateLimit(request, rateLimitConfigs.protected);
  if (!rateLimitResult.success) return rateLimitResponse(rateLimitResult);

  try {
    const body = await request.json();
    const validation = productSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Dados invalidos', details: validation.error.format() },
        { status: 400 }
      );
    }

    const firestoreData = {
      ...toFirestore(validation.data),
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), firestoreData);

    const newProduct = {
      id: docRef.id,
      ...validation.data
    };

    const response = NextResponse.json({ success: true, product: newProduct });
    return addRateLimitHeaders(response, rateLimitResult);
  } catch (error) {
    logger.error('Failed to create product', error as Error);
    return NextResponse.json({ success: false, error: 'Erro ao criar produto' }, { status: 500 });
  }
}

// PUT - Atualiza produto existente
export async function PUT(request: NextRequest) {
  const rateLimitResult = await rateLimit(request, rateLimitConfigs.protected);
  if (!rateLimitResult.success) return rateLimitResponse(rateLimitResult);

  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID obrigatorio' }, { status: 400 });
    }

    const validation = productSchema.partial().safeParse(data);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Dados invalidos', details: validation.error.format() },
        { status: 400 }
      );
    }

    // Para update, precisamos mesclar com cuidado ou converter apenas o que veio
    // Como toFirestore espera o objeto completo, vamos fazer manual para partial
    const updateData: any = {};
    if (data.name !== undefined) updateData.nome = data.name;
    if (data.description !== undefined) updateData.descricao = data.description;
    if (data.price !== undefined) updateData.preco = data.price;
    if (data.image !== undefined) updateData.imagem = data.image;
    if (data.categoryId !== undefined) updateData.categoriaId = data.categoryId;
    if (data.active !== undefined) updateData.ativo = data.active;
    if (data.featured !== undefined) updateData.destaque = data.featured;
    if (data.preparationTime !== undefined) updateData.tempoPreparo = data.preparationTime;
    if (data.serves !== undefined) updateData.porcoes = data.serves;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.stock !== undefined) updateData.estoque = data.stock;
    
    updateData.updatedAt = new Date().toISOString();

    const productRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(productRef, updateData);

    const response = NextResponse.json({ success: true, product: { id, ...data } });
    return addRateLimitHeaders(response, rateLimitResult);
  } catch (error) {
    logger.error('Failed to update product', error as Error);
    return NextResponse.json({ success: false, error: 'Erro ao atualizar produto' }, { status: 500 });
  }
}

// DELETE - Remove produto
export async function DELETE(request: NextRequest) {
  const rateLimitResult = await rateLimit(request, rateLimitConfigs.protected);
  if (!rateLimitResult.success) return rateLimitResponse(rateLimitResult);

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID obrigatorio' }, { status: 400 });
    }

    const productRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(productRef);

    const response = NextResponse.json({ success: true });
    return addRateLimitHeaders(response, rateLimitResult);
  } catch (error) {
    logger.error('Failed to delete product', error as Error);
    return NextResponse.json({ success: false, error: 'Erro ao remover produto' }, { status: 500 });
  }
}