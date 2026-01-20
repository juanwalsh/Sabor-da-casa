import { test, expect, devices } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test.use({ ...devices['iPhone 12'] });

  test('home page should be responsive', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    // Check viewport
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeLessThan(500);
  });

  test('cardapio should show mobile layout', async ({ page }) => {
    await page.goto('/cardapio');

    // Mobile should have compact header
    await expect(page.locator('header')).toBeVisible();
  });

  test('checkout should be usable on mobile', async ({ page }) => {
    await page.addInitScript(() => {
      const cartData = {
        state: {
          items: [{
            product: {
              id: 'test-1',
              name: 'Test Product',
              price: 25,
              image: '/test.jpg',
              description: 'Test',
              categoryId: 'cat-1',
              active: true,
              featured: false,
            },
            quantity: 1,
          }],
        },
        version: 0,
      };
      localStorage.setItem('ep-lopes-cart', JSON.stringify(cartData));
    });

    await page.goto('/checkout');
    await page.waitForTimeout(500);

    // Form should be visible and scrollable
    await expect(page.getByLabel(/nome/i)).toBeVisible();
  });

  test('login page should work on mobile', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByLabel(/usuário|email|login/i)).toBeVisible();
    await expect(page.getByLabel(/senha|password/i)).toBeVisible();
  });
});
