'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc, Timestamp, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, OrderStatus } from '@/types';
import { toast } from 'sonner';

// Mapeia status PT -> EN para pedidos legados
const statusMap: Record<string, OrderStatus> = {
  pendente: 'pending',
  confirmado: 'confirmed',
  preparando: 'preparing',
  pronto: 'ready',
  saiu_entrega: 'delivering',
  entregue: 'delivered',
  cancelado: 'cancelled',
};

const normalizeStatus = (status: string): OrderStatus => {
  if (['pending','confirmed','preparing','ready','delivering','delivered','cancelled'].includes(status)) {
    return status as OrderStatus;
  }
  return statusMap[status] || 'pending';
};

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const ordersRef = collection(db, 'orders');
    // Query: Data > 7 dias atras, ordenado por data (mais recente primeiro)
    const q = query(
      ordersRef, 
      where('createdAt', '>=', sevenDaysAgo.toISOString()),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const fetchedOrders: Order[] = snapshot.docs.map(doc => {
          const data = doc.data();
          
          // Mapeamento robusto do Firestore (PT/Nested) para App (EN/Flat)
          // O Checkout salva como 'cliente' e 'itens'
          const cliente = data.cliente || {};
          const endereco = cliente.endereco || data.address || {};
          
          return {
            id: doc.id,
            ...data,
            // Dados do Cliente
            customerName: data.customerName || cliente.nome || 'Cliente sem nome',
            customerPhone: data.customerPhone || cliente.telefone || '',
            customerEmail: data.customerEmail || cliente.email || '',
            
            // Endereço (Mapeando campos PT -> EN)
            address: {
              street: endereco.rua || endereco.street || '',
              number: endereco.numero || endereco.number || '',
              complement: endereco.complemento || endereco.complement || '',
              neighborhood: endereco.bairro || endereco.neighborhood || '',
              city: endereco.cidade || endereco.city || '',
              state: endereco.estado || endereco.state || '',
              zipCode: endereco.cep || endereco.zipCode || '',
            },
            
            // Itens e Valores
            items: (data.items || data.itens || []).map((item: any) => ({
              ...item,
              id: item.id || item.produtoId || item.productId || '',
              productId: item.productId || item.produtoId || '',
              quantity: item.quantity || item.quantidade || 1,
              unitPrice: item.unitPrice || item.precoUnitario || 0,
              product: item.product || {
                name: item.nome || 'Produto',
                price: item.precoUnitario || 0
              }
            })),
            subtotal: data.subtotal || 0,
            deliveryFee: data.deliveryFee ?? data.taxaEntrega ?? 0,
            discount: data.discount ?? data.desconto ?? 0,
            total: data.total || 0,
            
            // Status e Datas (normaliza PT -> EN)
            status: normalizeStatus(data.status || 'pending'),
            createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
          } as Order;
        });
        setOrders(fetchedOrders);
        setIsLoading(false);
      },
      (err) => {
        console.error('Erro ao ouvir pedidos em tempo real:', err);
        setError('Erro de conexão com pedidos');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Cria novo pedido (Mantido via API ou direto se preferir, mas API garante regras de negocio server-side)
  // Vamos manter a criacao via API para garantir consistencia de backend (pontos, notificacoes, etc)
  const createOrder = useCallback(async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Order | null> => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      const data = await response.json();

      if (data.success) {
        // O pedido vai aparecer automaticamente via onSnapshot
        return data.order;
      }
      return null;
    } catch (err) {
      console.error('Erro ao criar pedido:', err);
      toast.error('Erro ao criar pedido');
      return null;
    }
  }, []);

  // Atualiza status do pedido
  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus): Promise<boolean> => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date().toISOString()
      });
      
      // Feedback visual imediato nao necessario pois onSnapshot atualiza
      toast.success(`Status atualizado para ${status}`);
      return true;
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      toast.error('Erro ao atualizar status');
      return false;
    }
  }, []);

  // Deleta pedido
  const deleteOrder = useCallback(async (orderId: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      toast.success('Pedido excluído com sucesso');
      return true;
    } catch (err) {
      console.error('Erro ao excluir pedido:', err);
      toast.error('Erro ao excluir pedido');
      return false;
    }
  }, []);

  // Pega pedido por ID (da lista local)
  const getOrderById = useCallback((orderId: string): Order | undefined => {
    return orders.find(o => o.id === orderId);
  }, [orders]);

  // Pega pedidos por status
  const getOrdersByStatus = useCallback((status: OrderStatus): Order[] => {
    return orders.filter(o => o.status === status);
  }, [orders]);

  // Conta pedidos pendentes (Pendente, Confirmado, Preparando)
  const getPendingOrdersCount = useCallback((): number => {
    return orders.filter(o =>
      o.status === 'pending' ||
      o.status === 'confirmed' ||
      o.status === 'preparing'
    ).length;
  }, [orders]);

  // Estatisticas do dia (calculadas no cliente com base nos dados reais recebidos)
  const getTodayStats = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayOrders = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === yesterday.getTime();
    });

    return {
      ordersToday: todayOrders.length,
      ordersYesterday: yesterdayOrders.length,
      revenueToday: todayOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0),
      revenueYesterday: yesterdayOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0),
      averageTicket: todayOrders.length > 0
        ? todayOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0) / todayOrders.length
        : 0,
      pendingOrders: getPendingOrdersCount(),
    };
  }, [orders, getPendingOrdersCount]);

  return {
    orders,
    isLoading,
    error,
    fetchOrders: async () => {}, // No-op, ja que é realtime
    createOrder,
    updateOrderStatus,
    deleteOrder,
    getOrderById,
    getOrdersByStatus,
    getPendingOrdersCount,
    getTodayStats,
  };
}
