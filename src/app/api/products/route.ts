import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir, access } from 'fs/promises';
import { join } from 'path';
import { Product } from '@/types';
import { products as initialProducts } from '@/data/mockData';

export const dynamic = 'force-dynamic';

const DATA_DIR = join(process.cwd(), 'data');
const PRODUCTS_FILE = join(DATA_DIR, 'products.json');

// Garante que o diretorio existe
async function ensureDataDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Diretorio ja existe
  }
}

// Verifica se arquivo existe
async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

// Le produtos do arquivo JSON - inicializa automaticamente se nao existir
async function getProducts(): Promise<Product[]> {
  try {
    await ensureDataDir();

    // Se arquivo nao existe, inicializa com dados iniciais
    if (!(await fileExists(PRODUCTS_FILE))) {
      await writeFile(PRODUCTS_FILE, JSON.stringify(initialProducts, null, 2), 'utf-8');
      return initialProducts;
    }

    const data = await readFile(PRODUCTS_FILE, 'utf-8');
    const products = JSON.parse(data);

    // Se arquivo vazio, inicializa com dados iniciais
    if (!products || products.length === 0) {
      await writeFile(PRODUCTS_FILE, JSON.stringify(initialProducts, null, 2), 'utf-8');
      return initialProducts;
    }

    return products;
  } catch {
    // Em caso de erro, inicializa com dados iniciais
    await writeFile(PRODUCTS_FILE, JSON.stringify(initialProducts, null, 2), 'utf-8');
    return initialProducts;
  }
}

// Salva produtos no arquivo JSON
async function saveProducts(products: Product[]): Promise<void> {
  await ensureDataDir();
  await writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

// GET - Lista todos os produtos
export async function GET() {
  try {
    const products = await getProducts();
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
    const products = await getProducts();

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: body.name,
      description: body.description,
      price: body.price,
      image: body.image,
      categoryId: body.categoryId,
      active: body.active ?? true,
      featured: body.featured ?? false,
      preparationTime: body.preparationTime,
      serves: body.serves,
      tags: body.tags || [],
      stock: body.stock ?? 100,
    };

    products.unshift(newProduct);
    await saveProducts(products);

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
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do produto e obrigatorio' },
        { status: 400 }
      );
    }

    const products = await getProducts();
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Produto nao encontrado' },
        { status: 404 }
      );
    }

    products[index] = { ...products[index], ...updates };
    await saveProducts(products);

    return NextResponse.json({ success: true, product: products[index] });
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

    const products = await getProducts();
    const filtered = products.filter(p => p.id !== id);

    if (filtered.length === products.length) {
      return NextResponse.json(
        { success: false, error: 'Produto nao encontrado' },
        { status: 404 }
      );
    }

    await saveProducts(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao remover produto' },
      { status: 500 }
    );
  }
}
