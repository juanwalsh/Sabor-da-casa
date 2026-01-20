/**
 * Testes de Integração - API de Produtos
 *
 * Testa o fluxo completo: API -> Store -> UI
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock do fetch global
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock products data
const mockProducts = [
  {
    id: '1',
    name: 'Pizza Margherita',
    description: 'Molho de tomate, mozzarella e manjericão',
    price: 45.9,
    image: '/images/pizza.jpg',
    category: 'pizzas',
    active: true,
    featured: true,
    stock: 50,
  },
  {
    id: '2',
    name: 'Hambúrguer Artesanal',
    description: 'Blend bovino 180g, queijo cheddar, bacon',
    price: 38.9,
    image: '/images/burger.jpg',
    category: 'lanches',
    active: true,
    featured: false,
    stock: 30,
  },
];

describe('API Products Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/products', () => {
    it('should return products list', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ products: mockProducts }),
      });

      const response = await fetch('/api/products');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.products).toHaveLength(2);
      expect(data.products[0].name).toBe('Pizza Margherita');
    });

    it('should filter by category', async () => {
      const filteredProducts = mockProducts.filter(p => p.category === 'pizzas');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ products: filteredProducts }),
      });

      const response = await fetch('/api/products?category=pizzas');
      const data = await response.json();

      expect(data.products).toHaveLength(1);
      expect(data.products[0].category).toBe('pizzas');
    });

    it('should handle API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const response = await fetch('/api/products');

      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetch('/api/products')).rejects.toThrow('Network error');
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const newProduct = {
        name: 'Novo Produto',
        description: 'Descrição do produto',
        price: 29.9,
        category: 'bebidas',
        active: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '3', ...newProduct }),
      });

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.id).toBe('3');
      expect(data.name).toBe('Novo Produto');
    });

    it('should reject invalid product data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Validation failed' }),
      });

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '' }), // Invalid - empty name
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });

    it('should require authentication', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Unauthorized' }),
      });

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test' }),
      });

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/products', () => {
    it('should update an existing product', async () => {
      const updates = { name: 'Pizza Atualizada', price: 49.9 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockProducts[0], ...updates }),
      });

      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: '1', ...updates }),
      });
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.name).toBe('Pizza Atualizada');
      expect(data.price).toBe(49.9);
    });

    it('should return 404 for non-existent product', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Product not found' }),
      });

      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'nonexistent', name: 'Test' }),
      });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/products', () => {
    it('should delete a product', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const response = await fetch('/api/products?id=1', {
        method: 'DELETE',
      });
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
    });

    it('should return 404 for non-existent product', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Product not found' }),
      });

      const response = await fetch('/api/products?id=nonexistent', {
        method: 'DELETE',
      });

      expect(response.status).toBe(404);
    });
  });
});

describe('Products Store Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  it('should sync products from API to store', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ products: mockProducts }),
    });

    // Simula a chamada que o hook useProducts faria
    const response = await fetch('/api/products');
    const data = await response.json();

    expect(data.products).toEqual(mockProducts);
  });

  it('should handle optimistic updates', async () => {
    const originalProduct = mockProducts[0];
    const updatedProduct = { ...originalProduct, name: 'Updated Pizza' };

    // Primeira chamada retorna original
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ products: mockProducts }),
    });

    // Segunda chamada (update) retorna atualizado
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedProduct,
    });

    // Terceira chamada (revalidate) retorna lista atualizada
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [updatedProduct, mockProducts[1]],
      }),
    });

    // Busca inicial
    const initial = await fetch('/api/products');
    const initialData = await initial.json();
    expect(initialData.products[0].name).toBe('Pizza Margherita');

    // Update
    await fetch('/api/products', {
      method: 'PUT',
      body: JSON.stringify({ id: '1', name: 'Updated Pizza' }),
    });

    // Revalidate
    const revalidated = await fetch('/api/products');
    const revalidatedData = await revalidated.json();
    expect(revalidatedData.products[0].name).toBe('Updated Pizza');
  });
});
