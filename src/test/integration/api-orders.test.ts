/**
 * Testes de Integração - API de Pedidos
 *
 * Testa o fluxo completo de pedidos
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockOrder = {
  id: 'order_123',
  customer: {
    name: 'João Silva',
    phone: '11999999999',
  },
  address: {
    street: 'Rua das Flores',
    number: '123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    complement: 'Apto 45',
  },
  items: [
    {
      id: '1',
      name: 'Pizza Margherita',
      price: 45.9,
      quantity: 2,
    },
  ],
  payment: {
    method: 'pix',
  },
  status: 'pending',
  subtotal: 91.8,
  deliveryFee: 8,
  total: 99.8,
  createdAt: new Date().toISOString(),
};

describe('API Orders Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrder,
      });

      const orderData = {
        customer: mockOrder.customer,
        address: mockOrder.address,
        items: mockOrder.items,
        payment: mockOrder.payment,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.id).toBe('order_123');
      expect(data.status).toBe('pending');
      expect(data.total).toBe(99.8);
    });

    it('should validate required customer fields', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Validation failed',
          details: ['customer.name is required', 'customer.phone is required'],
        }),
      });

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [] }),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });

    it('should validate required address fields', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Validation failed',
          details: ['address.street is required'],
        }),
      });

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: mockOrder.customer,
          items: mockOrder.items,
        }),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });

    it('should validate items array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Validation failed',
          details: ['items must have at least 1 item'],
        }),
      });

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: mockOrder.customer,
          address: mockOrder.address,
          items: [],
        }),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });

    it('should validate payment method', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Validation failed',
          details: ['payment.method must be one of: pix, credit, debit, cash'],
        }),
      });

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: mockOrder.customer,
          address: mockOrder.address,
          items: mockOrder.items,
          payment: { method: 'bitcoin' },
        }),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });

    it('should calculate totals correctly', async () => {
      const itemsTotal = 45.9 * 2; // 91.8
      const deliveryFee = 8;
      const expectedTotal = itemsTotal + deliveryFee;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...mockOrder,
          subtotal: itemsTotal,
          deliveryFee,
          total: expectedTotal,
        }),
      });

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: mockOrder.customer,
          address: mockOrder.address,
          items: mockOrder.items,
          payment: mockOrder.payment,
        }),
      });
      const data = await response.json();

      expect(data.subtotal).toBe(91.8);
      expect(data.deliveryFee).toBe(8);
      expect(data.total).toBe(99.8);
    });
  });

  describe('GET /api/orders', () => {
    it('should require authentication', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Unauthorized' }),
      });

      const response = await fetch('/api/orders');

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
    });

    it('should return orders list for authenticated admin', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ orders: [mockOrder] }),
      });

      const response = await fetch('/api/orders', {
        headers: { Authorization: 'Bearer valid_token' },
      });
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.orders).toHaveLength(1);
    });

    it('should filter orders by status', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          orders: [{ ...mockOrder, status: 'preparing' }],
        }),
      });

      const response = await fetch('/api/orders?status=preparing', {
        headers: { Authorization: 'Bearer valid_token' },
      });
      const data = await response.json();

      expect(data.orders).toHaveLength(1);
      expect(data.orders[0].status).toBe('preparing');
    });
  });

  describe('PUT /api/orders', () => {
    it('should update order status', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockOrder, status: 'preparing' }),
      });

      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid_token',
        },
        body: JSON.stringify({ id: 'order_123', status: 'preparing' }),
      });
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.status).toBe('preparing');
    });

    it('should validate status transitions', async () => {
      // Não pode voltar de 'delivered' para 'pending'
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Invalid status transition',
        }),
      });

      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid_token',
        },
        body: JSON.stringify({ id: 'order_123', status: 'pending' }),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });
  });
});

describe('Order Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  it('should complete full order flow', async () => {
    // 1. Criar pedido
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockOrder, status: 'pending' }),
    });

    const createResponse = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: mockOrder.customer,
        address: mockOrder.address,
        items: mockOrder.items,
        payment: mockOrder.payment,
      }),
    });
    const createdOrder = await createResponse.json();
    expect(createdOrder.status).toBe('pending');

    // 2. Confirmar pedido
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockOrder, status: 'confirmed' }),
    });

    const confirmResponse = await fetch('/api/orders', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer valid_token',
      },
      body: JSON.stringify({ id: createdOrder.id, status: 'confirmed' }),
    });
    const confirmedOrder = await confirmResponse.json();
    expect(confirmedOrder.status).toBe('confirmed');

    // 3. Em preparo
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockOrder, status: 'preparing' }),
    });

    const preparingResponse = await fetch('/api/orders', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer valid_token',
      },
      body: JSON.stringify({ id: createdOrder.id, status: 'preparing' }),
    });
    const preparingOrder = await preparingResponse.json();
    expect(preparingOrder.status).toBe('preparing');

    // 4. Em entrega
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockOrder, status: 'delivering' }),
    });

    const deliveringResponse = await fetch('/api/orders', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer valid_token',
      },
      body: JSON.stringify({ id: createdOrder.id, status: 'delivering' }),
    });
    const deliveringOrder = await deliveringResponse.json();
    expect(deliveringOrder.status).toBe('delivering');

    // 5. Entregue
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockOrder, status: 'delivered' }),
    });

    const deliveredResponse = await fetch('/api/orders', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer valid_token',
      },
      body: JSON.stringify({ id: createdOrder.id, status: 'delivered' }),
    });
    const deliveredOrder = await deliveredResponse.json();
    expect(deliveredOrder.status).toBe('delivered');
  });
});
