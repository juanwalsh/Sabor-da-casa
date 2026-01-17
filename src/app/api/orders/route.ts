import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { Order, OrderStatus } from '@/types';

export const dynamic = 'force-dynamic';

const DATA_DIR = join(process.cwd(), 'data');
const ORDERS_FILE = join(DATA_DIR, 'orders.json');

async function ensureDataDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Diretorio ja existe
  }
}

async function getOrders(): Promise<Order[]> {
  try {
    await ensureDataDir();
    const data = await readFile(ORDERS_FILE, 'utf-8');
    const orders = JSON.parse(data);
    // Converte strings de data para Date objects
    return orders.map((order: Order) => ({
      ...order,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt),
      estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery) : undefined,
    }));
  } catch {
    return [];
  }
}

async function saveOrders(orders: Order[]): Promise<void> {
  await ensureDataDir();
  await writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
}

// GET - Lista todos os pedidos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as OrderStatus | null;
    const customerId = searchParams.get('customerId');

    let orders = await getOrders();

    if (status) {
      orders = orders.filter(o => o.status === status);
    }

    if (customerId) {
      orders = orders.filter(o => o.customerPhone === customerId);
    }

    // Ordena por data (mais recente primeiro)
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar pedidos' },
      { status: 500 }
    );
  }
}

// POST - Cria novo pedido
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const orders = await getOrders();

    const now = new Date();
    const estimatedDelivery = new Date(now.getTime() + 45 * 60000); // +45 minutos

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      address: body.address,
      items: body.items,
      subtotal: body.subtotal,
      deliveryFee: body.deliveryFee,
      discount: body.discount || 0,
      total: body.total,
      status: 'pending',
      paymentMethod: body.paymentMethod,
      notes: body.notes,
      createdAt: now,
      updatedAt: now,
      estimatedDelivery,
    };

    orders.unshift(newOrder);
    await saveOrders(orders);

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar pedido' },
      { status: 500 }
    );
  }
}

// PUT - Atualiza status do pedido
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, ...otherUpdates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do pedido e obrigatorio' },
        { status: 400 }
      );
    }

    const orders = await getOrders();
    const index = orders.findIndex(o => o.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Pedido nao encontrado' },
        { status: 404 }
      );
    }

    orders[index] = {
      ...orders[index],
      ...otherUpdates,
      status: status || orders[index].status,
      updatedAt: new Date(),
    };

    await saveOrders(orders);

    return NextResponse.json({ success: true, order: orders[index] });
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar pedido' },
      { status: 500 }
    );
  }
}
