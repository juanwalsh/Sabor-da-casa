import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { Product } from '@/types';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const COLLECTION_NAME = 'products';

const productSchema = z.object({
  name: z.string().min(1, 'Nome obrigatorio'),
  description: z.string().min(1, 'Descricao obrigatoria'),
  price: z.coerce.number().positive('Preco deve ser positivo'),
  image: z.string().url('URL de imagem invalida'),
  categoryId: z.string().min(1, 'Categoria obrigatoria'),
  active: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  preparationTime: z.coerce.number().int().nonnegative('Tempo de preparo invalido').optional(),
  serves: z.coerce.number().int().positive('Numero de pessoas invalido').optional(),
  tags: z.array(z.string()).optional().default([]),
  stock: z.coerce.number().int().nonnegative('Estoque invalido').default(100),
});

// GET - Lista todos os produtos
export async function GET() {
  try {
    const productsRef = collection(db, COLLECTION_NAME);
    let q = query(productsRef); 
    
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}

// POST - Cria novo produto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = productSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Dados invalidos', details: validation.error.format() },
        { status: 400 }
      );
    }

    const newProductData = {
      ...validation.data,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), newProductData);
    
    const newProduct = {
      id: docRef.id,
      ...newProductData
    };

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar produto' },
      { status: 500 }
    );
  }
}

// PUT - Atualiza produto existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do produto e obrigatorio' },
        { status: 400 }
      );
    }

    // Valida apenas os campos enviados (partial)
    const validation = productSchema.partial().safeParse(data);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Dados invalidos', details: validation.error.format() },
        { status: 400 }
      );
    }

    const productRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(productRef, validation.data);

    return NextResponse.json({ success: true, product: { id, ...validation.data } });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar produto' },
      { status: 500 }
    );
  }
}

// DELETE - Remove produto
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do produto e obrigatorio' },
        { status: 400 }
      );
    }

    const productRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(productRef);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao remover produto' },
      { status: 500 }
    );
  }
}
