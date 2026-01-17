import { NextResponse } from 'next/server';
import { readFile, writeFile, mkdir, access } from 'fs/promises';
import { join } from 'path';
import { products as initialProducts } from '@/data/mockData';

const DATA_DIR = join(process.cwd(), 'data');
const PRODUCTS_FILE = join(DATA_DIR, 'products.json');
const ORDERS_FILE = join(DATA_DIR, 'orders.json');
const CUSTOMERS_FILE = join(DATA_DIR, 'customers.json');

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

// GET - Inicializa os arquivos de dados se nao existirem
export async function GET() {
  try {
    await mkdir(DATA_DIR, { recursive: true });

    const results = {
      products: false,
      orders: false,
      customers: false,
    };

    // Inicializa produtos
    if (!(await fileExists(PRODUCTS_FILE))) {
      await writeFile(PRODUCTS_FILE, JSON.stringify(initialProducts, null, 2), 'utf-8');
      results.products = true;
    }

    // Inicializa pedidos (array vazio)
    if (!(await fileExists(ORDERS_FILE))) {
      await writeFile(ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
      results.orders = true;
    }

    // Inicializa clientes (array vazio)
    if (!(await fileExists(CUSTOMERS_FILE))) {
      await writeFile(CUSTOMERS_FILE, JSON.stringify([], null, 2), 'utf-8');
      results.customers = true;
    }

    return NextResponse.json({
      success: true,
      message: 'Dados inicializados',
      initialized: results
    });
  } catch (error) {
    console.error('Erro ao inicializar dados:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao inicializar dados' },
      { status: 500 }
    );
  }
}

// POST - Forca reinicializacao dos dados (cuidado: sobrescreve tudo)
export async function POST() {
  try {
    await mkdir(DATA_DIR, { recursive: true });

    await writeFile(PRODUCTS_FILE, JSON.stringify(initialProducts, null, 2), 'utf-8');
    await writeFile(ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
    await writeFile(CUSTOMERS_FILE, JSON.stringify([], null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Dados reinicializados com sucesso'
    });
  } catch (error) {
    console.error('Erro ao reinicializar dados:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao reinicializar dados' },
      { status: 500 }
    );
  }
}
