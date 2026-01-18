import { test, expect } from '@playwright/test';

test.describe('Security & Auth Checks', () => {
  
  test('API Products POST should be protected (401)', async ({ request }) => {
    const response = await request.post('/api/products', {
      data: { name: 'Hacker Product', price: 0 }
    });
    expect(response.status()).toBe(401);
  });

  test('API Orders PUT should be protected (401)', async ({ request }) => {
    const response = await request.put('/api/orders', {
      data: { id: 'some-id', status: 'delivered' }
    });
    expect(response.status()).toBe(401);
  });

  test('Admin Page should redirect to Login if unauthenticated', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('Login should work with correct credentials', async ({ request }) => {
    // Note: This relies on the .env ADMIN_PASSWORD set in the session
    const response = await request.post('/api/auth', {
      data: { username: 'admin', password: 'eplopesfortedogelo_SECURE' }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    
    // Check for cookie
    const headers = response.headers();
    expect(headers['set-cookie']).toContain('admin_token');
  });

  test('Login should fail with wrong credentials', async ({ request }) => {
    const response = await request.post('/api/auth', {
      data: { username: 'admin', password: 'wrongpassword' }
    });
    expect(response.status()).toBe(401);
  });

});
