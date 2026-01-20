import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  test('GET /api/products should return products', async ({ request }) => {
    const response = await request.get('/api/products');
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data).toHaveProperty('success');
    expect(data).toHaveProperty('products');
    expect(Array.isArray(data.products)).toBeTruthy();
  });

  test('POST /api/products without auth should return 401', async ({ request }) => {
    const response = await request.post('/api/products', {
      data: {
        name: 'Test',
        description: 'Test',
        price: 10,
        image: 'https://example.com/image.jpg',
        categoryId: 'cat-1',
      },
    });
    expect(response.status()).toBe(401);
  });

  test('PUT /api/products without auth should return 401', async ({ request }) => {
    const response = await request.put('/api/products', {
      data: {
        id: 'test-id',
        name: 'Updated',
      },
    });
    expect(response.status()).toBe(401);
  });

  test('DELETE /api/products without auth should return 401', async ({ request }) => {
    const response = await request.delete('/api/products?id=test-id');
    expect(response.status()).toBe(401);
  });

  test('GET /api/orders without auth should return 401', async ({ request }) => {
    const response = await request.get('/api/orders');
    expect(response.status()).toBe(401);
  });

  test('POST /api/orders should validate required fields', async ({ request }) => {
    const response = await request.post('/api/orders', {
      data: {
        customerName: '',
        items: [],
      },
    });
    expect(response.status()).toBe(400);
  });

  test('POST /api/auth with invalid credentials should return 401', async ({ request }) => {
    const response = await request.post('/api/auth', {
      data: {
        username: 'invalid',
        password: 'invalid',
      },
    });
    expect(response.status()).toBe(401);
  });

  test('POST /api/auth without credentials should return 400', async ({ request }) => {
    const response = await request.post('/api/auth', {
      data: {},
    });
    expect(response.status()).toBe(400);
  });
});
