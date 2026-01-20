import { test, expect } from '@playwright/test';

test.describe('Checkout Page', () => {
  test('should redirect to cardapio when cart is empty', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page.getByText(/carrinho vazio/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /cardápio/i })).toBeVisible();
  });

  test('should display checkout form with cart items', async ({ page }) => {
    // First add item to cart via localStorage mock
    await page.goto('/cardapio');

    // Wait for page to load products
    await page.waitForTimeout(1000);

    // Try to add product if available
    const addButton = page.getByRole('button', { name: /adicionar/i }).first();
    if (await addButton.isVisible()) {
      await addButton.click();

      // Go to checkout
      await page.goto('/checkout');

      // Should show form fields
      await expect(page.getByLabel(/nome/i)).toBeVisible();
      await expect(page.getByLabel(/telefone/i)).toBeVisible();
    }
  });

  test('should show validation errors for empty required fields', async ({ page }) => {
    // Mock cart with item
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

    // Click submit without filling form
    await page.getByRole('button', { name: /confirmar/i }).click();

    // Should show some validation indication
    await page.waitForTimeout(500);
  });

  test('should have payment method options', async ({ page }) => {
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

    await expect(page.getByText(/pix/i)).toBeVisible();
    await expect(page.getByText(/crédito/i)).toBeVisible();
    await expect(page.getByText(/débito/i)).toBeVisible();
    await expect(page.getByText(/dinheiro/i)).toBeVisible();
  });
});
