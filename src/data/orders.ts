import { Order } from '@/types';

export const mockOrders: Order[] = [
  {
    id: 'order-001',
    customerName: 'Maria Santos',
    customerPhone: '(22) 99999-1111',
    customerEmail: 'maria@email.com',
    address: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'Sao Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    items: [
      { id: 'item-1', productId: 'prod-20', quantity: 1, unitPrice: 29.90 },
      { id: 'item-2', productId: 'prod-53', quantity: 2, unitPrice: 7.99 }
    ],
    subtotal: 45.88,
    deliveryFee: 8.00,
    discount: 0,
    total: 53.88,
    status: 'preparing',
    paymentMethod: 'pix',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
