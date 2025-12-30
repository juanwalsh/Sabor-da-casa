import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

export interface OrderHistory {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'pending' | 'confirmed' | 'delivered';
  rating?: number;
}

interface OrderHistoryState {
  orders: OrderHistory[];
  addOrder: (order: Omit<OrderHistory, 'id' | 'date'>) => string;
  getOrders: () => OrderHistory[];
  getLastOrder: () => OrderHistory | null;
  rateOrder: (orderId: string, rating: number) => void;
  clearHistory: () => void;
}

export const useOrderHistoryStore = create<OrderHistoryState>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order) => {
        const id = `order-${Date.now()}`;
        const newOrder: OrderHistory = {
          ...order,
          id,
          date: new Date().toISOString(),
        };
        set((state) => ({
          orders: [newOrder, ...state.orders].slice(0, 20), // Manter últimos 20 pedidos
        }));
        return id;
      },

      getOrders: () => get().orders,

      getLastOrder: () => {
        const orders = get().orders;
        return orders.length > 0 ? orders[0] : null;
      },

      rateOrder: (orderId, rating) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, rating } : order
          ),
        }));
      },

      clearHistory: () => set({ orders: [] }),
    }),
    {
      name: 'sabor-da-casa-order-history',
    }
  )
);
