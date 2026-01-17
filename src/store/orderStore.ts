import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, OrderStatus } from '@/types';
import { mockOrders } from '@/data/mockData';

interface OrderState {
  orders: Order[];
  isLoading: boolean;

  // Actions
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByStatus: (status: OrderStatus) => Order[];
  getPendingOrdersCount: () => number;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: mockOrders,
      isLoading: false,

      addOrder: (order: Order) => {
        set((state) => ({
          orders: [order, ...state.orders],
        }));
      },

      updateOrderStatus: (orderId: string, status: OrderStatus) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date() }
              : order
          ),
        }));
      },

      getOrderById: (orderId: string) => {
        return get().orders.find((order) => order.id === orderId);
      },

      getOrdersByStatus: (status: OrderStatus) => {
        return get().orders.filter((order) => order.status === status);
      },

      getPendingOrdersCount: () => {
        return get().orders.filter(
          (order) =>
            order.status === 'pending' ||
            order.status === 'confirmed' ||
            order.status === 'preparing'
        ).length;
      },
    }),
    {
      name: 'ep-lopes-orders',
    }
  )
);
