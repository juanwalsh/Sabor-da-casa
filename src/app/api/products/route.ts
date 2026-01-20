import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { Product } from '@/types';
import { z } from 'zod';
import { rateLimit, rateLimitConfigs, rateLimitResponse, addRateLimitHeaders } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

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
export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = await rateLimit(request, rateLimitConfigs.public);
  if (!rateLimitResult.success) {
    logger.warn('Rate limit exceeded for products GET', { action: 'rate_limit' });
    return rateLimitResponse(rateLimitResult);
  }

  const endTiming = logger.time('GET /api/products');

  try {
    const productsRef = collection(db, COLLECTION_NAME);
    const q = query(productsRef);

    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];

    endTiming();
    logger.info('Products fetched successfully', { action: 'products_fetch', count: products.length });

    const response = NextResponse.json({ success: true, products });
    return addRateLimitHeaders(response, rateLimitResult);
  } catch (error) {
    logger.error('Failed to fetch products', error as Error, { action: 'products_fetch_error' });
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}

// POST - Cria novo produto
export async function POST(request: NextRequest) {
  // Rate limiting para rotas protegidas
  const rateLimitResult = await rateLimit(request, rateLimitConfigs.protected);
  if (!rateLimitResult.success) {
    logger.warn('Rate limit exceeded for products POST', { action: 'rate_limit' });
    return rateLimitResponse(rateLimitResult);
  }

  const endTiming = logger.time('POST /api/products');

  try {
    const body = await request.json();

    const validation = productSchema.safeParse(body);

    if (!validation.success) {
      logger.warn('Product validation failed', { action: 'product_validation_error' });
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

    endTiming();
    logger.info('Product created successfully', { action: 'product_create', productId: docRef.id });

    const response = NextResponse.json({ success: true, product: newProduct });
    return addRateLimitHeaders(response, rateLimitResult);
  } catch (error) {
    logger.error('Failed to create product', error as Error, { action: 'product_create_error' });
    return NextResponse.json(
      { success: false, error: 'Erro ao criar produto' },
      { status: 500 }
    );
  }
}

// PUT - Atualiza produto existente
export async function PUT(request: NextRequest) {
  const rateLimitResult = await rateLimit(request, rateLimitConfigs.protected);
  if (!rateLimitResult.success) {
    logger.warn('Rate limit exceeded for products PUT', { action: 'rate_limit' });
    return rateLimitResponse(rateLimitResult);
  }

  const endTiming = logger.time('PUT /api/products');

  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do produto e obrigatorio' },
        { status: 400 }
      );
    }

    const validation = productSchema.partial().safeParse(data);

    if (!validation.success) {
      logger.warn('Product update validation failed', { action: 'product_validation_error', productId: id });
      return NextResponse.json(
        { success: false, error: 'Dados invalidos', details: validation.error.format() },
        { status: 400 }
      );
    }

    const productRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(productRef, validation.data);

    endTiming();
    logger.info('Product updated successfully', { action: 'product_update', productId: id });

    const response = NextResponse.json({ success: true, product: { id, ...validation.data } });
    return addRateLimitHeaders(response, rateLimitResult);
  } catch (error) {
    logger.error('Failed to update product', error as Error, { action: 'product_update_error' });
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar produto' },
      { status: 500 }
    );
  }
}

// DELETE - Remove produto
export async function DELETE(request: NextRequest) {
  const rateLimitResult = await rateLimit(request, rateLimitConfigs.protected);
  if (!rateLimitResult.success) {
    logger.warn('Rate limit exceeded for products DELETE', { action: 'rate_limit' });
    return rateLimitResponse(rateLimitResult);
  }

  const endTiming = logger.time('DELETE /api/products');

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

    endTiming();
    logger.info('Product deleted successfully', { action: 'product_delete', productId: id });

    const response = NextResponse.json({ success: true });
    return addRateLimitHeaders(response, rateLimitResult);
  } catch (error) {
    logger.error('Failed to delete product', error as Error, { action: 'product_delete_error' });
    return NextResponse.json(
      { success: false, error: 'Erro ao remover produto' },
      { status: 500 }
    );
  }
}
