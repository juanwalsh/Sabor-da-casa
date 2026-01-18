import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, query, where, orderBy, runTransaction, getDoc } from 'firebase/firestore';
import { Order, OrderStatus } from '@/types';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const COLLECTION_NAME = 'orders';
const PRODUCTS_COLLECTION = 'products';

// Schema de validacao para criacao de pedido
const orderItemSchema = z.object({
  product: z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    image: z.string(),
  }),
  quantity: z.number().int().positive(),
  observation: z.string().optional(),
});

const createOrderSchema = z.object({
  customerName: z.string().min(1, 'Nome do cliente obrigatorio'),
  customerPhone: z.string().min(10, 'Telefone invalido'),
  customerEmail: z.string().email().optional().or(z.literal('')),
  address: z.object({
    street: z.string().min(1),
    number: z.string().min(1),
    complement: z.string().optional(),
    neighborhood: z.string().min(1),
    city: z.string().min(1),
    zipCode: z.string().min(8),
  }),
  items: z.array(orderItemSchema).min(1, 'Pedido deve ter pelo menos 1 item'),
  subtotal: z.number().nonnegative(),
  deliveryFee: z.number().nonnegative(),
  discount: z.number().nonnegative().optional(),
  total: z.number().nonnegative(),
  paymentMethod: z.enum(['pix', 'credit_card', 'debit_card', 'cash']),
  notes: z.string().optional(),
});

// Schema de validacao para atualizacao de pedido
const updateOrderSchema = z.object({
  id: z.string().min(1),
  status: z.enum(['pending', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled']),
});

// GET - Lista todos os pedidos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as OrderStatus | null;
    const customerId = searchParams.get('customerId');

    const ordersRef = collection(db, COLLECTION_NAME);
    let q = query(ordersRef, orderBy('createdAt', 'desc'));

    if (status) {
      q = query(q, where('status', '==', status));
    }

    if (customerId) {
      q = query(q, where('customerPhone', '==', customerId));
    }

    const snapshot = await getDocs(q);
    
    const orders = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
        estimatedDelivery: data.estimatedDelivery ? new Date(data.estimatedDelivery) : undefined,
      };
    }) as Order[];

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar pedidos' },
      { status: 500 }
    );
  }
}

// POST - Cria novo pedido com Transacao (Estoque)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validacao Zod
    const validation = createOrderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Dados invalidos', details: validation.error.format() },
        { status: 400 }
      );
    }

    const orderData = validation.data;
    
    const now = new Date();
    const estimatedDelivery = new Date(now.getTime() + 45 * 60000); // +45 minutos

    // Usar transacao para garantir consistencia de estoque
    try {
      const newOrderId = await runTransaction(db, async (transaction) => {
        // 1. Verificar estoque de todos os itens
        for (const item of orderData.items) {
          const productRef = doc(db, PRODUCTS_COLLECTION, item.product.id);
          const productDoc = await transaction.get(productRef);
          
          if (!productDoc.exists()) {
            throw new Error(`Produto ${item.product.name} nao encontrado`);
          }

          const currentStock = productDoc.data().stock || 0;
          if (currentStock < item.quantity) {
            throw new Error(`Estoque insuficiente para ${item.product.name}`);
          }

          // 2. Deduzir estoque
          transaction.update(productRef, { stock: currentStock - item.quantity });
        }

        // 3. Criar pedido
        const newOrderRef = doc(collection(db, COLLECTION_NAME));
        const finalOrderData = {
          ...orderData,
          status: 'pending',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          estimatedDelivery: estimatedDelivery.toISOString(),
        };
        
        transaction.set(newOrderRef, finalOrderData);
        return newOrderRef.id;
      });

      const newOrder = {
        id: newOrderId,
        ...orderData,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
        estimatedDelivery
      };

      return NextResponse.json({ success: true, order: newOrder });

    } catch (txError: any) {
      console.error('Erro de transacao (estoque):', txError);
      return NextResponse.json(
        { success: false, error: txError.message || 'Erro ao processar pedido (estoque)' },
        { status: 409 } // Conflict
      );
    }

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
    
    // Validacao Zod
    const validation = updateOrderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Dados invalidos', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { id, status } = validation.data;

    const orderRef = doc(db, COLLECTION_NAME, id);
    const orderDoc = await getDoc(orderRef);

    if (!orderDoc.exists()) {
      return NextResponse.json(
        { success: false, error: 'Pedido nao encontrado' },
        { status: 404 }
      );
    }
    
    // Se pedido for cancelado, devolver estoque? (Implementacao futura)
    // Por enquanto apenas atualiza status

    const updates = {
      status: status,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(orderRef, updates);

    return NextResponse.json({ success: true, order: { id, ...updates } });
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar pedido' },
      { status: 500 }
    );
  }
}
