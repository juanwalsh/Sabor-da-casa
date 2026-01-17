'use client';

import { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '@/types';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega pedidos da API
  const fetchOrders = useCallback(async (status?: OrderStatus) => {
    try {
      setIsLoading(true);
      const url = status ? `/api/orders?status=${status}` : '/api/orders';
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        // Converte datas de string para Date
        const ordersWithDates = data.orders.map((order: Order) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt),
          estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery) : undefined,
        }));
        setOrders(ordersWithDates);
      }
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
      setError('Erro ao carregar pedidos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cria novo pedido
  const createOrder = useCallback(async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Order | null> => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      const data = await response.json();

      if (data.success) {
        const newOrder = {
          ...data.order,
          createdAt: new Date(data.order.createdAt),
          updatedAt: new Date(data.order.updatedAt),
          estimatedDelivery: data.order.estimatedDelivery ? new Date(data.order.estimatedDelivery) : undefined,
        };
        setOrders(prev => [newOrder, ...prev]);

        // Atualiza pontos do cliente
        await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: order.customerName,
            phone: order.customerPhone,
            email: order.customerEmail,
            orderTotal: order.total,
          }),
        });

        return newOrder;
      }
      return null;
    } catch (err) {
      console.error('Erro ao criar pedido:', err);
      return null;
    }
  }, []);

  // Atualiza status do pedido
  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus): Promise<boolean> => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status }),
      });

      const data = await response.json();

      if (data.success) {
        setOrders(prev => prev.map(o =>
          o.id === orderId
            ? { ...o, status, updatedAt: new Date(data.order.updatedAt) }
            : o
        ));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      return false;
    }
  }, []);

  // Pega pedido por ID
  const getOrderById = useCallback((orderId: string): Order | undefined => {
    return orders.find(o => o.id === orderId);
  }, [orders]);

  // Pega pedidos por status
  const getOrdersByStatus = useCallback((status: OrderStatus): Order[] => {
    return orders.filter(o => o.status === status);
  }, [orders]);

  // Conta pedidos pendentes
  const getPendingOrdersCount = useCallback((): number => {
    return orders.filter(o =>
      o.status === 'pending' ||
      o.status === 'confirmed' ||
      o.status === 'preparing'
    ).length;
  }, [orders]);

  // Estatisticas do dia
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
      revenueToday: todayOrders.reduce((sum, o) => sum + o.total, 0),
      revenueYesterday: yesterdayOrders.reduce((sum, o) => sum + o.total, 0),
      averageTicket: todayOrders.length > 0
        ? todayOrders.reduce((sum, o) => sum + o.total, 0) / todayOrders.length
        : 0,
      pendingOrders: getPendingOrdersCount(),
    };
  }, [orders, getPendingOrdersCount]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    isLoading,
    error,
    fetchOrders,
    createOrder,
    updateOrderStatus,
    getOrderById,
    getOrdersByStatus,
    getPendingOrdersCount,
    getTodayStats,
  };
}
