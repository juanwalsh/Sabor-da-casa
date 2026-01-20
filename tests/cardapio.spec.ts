import { test, expect } from '@playwright/test';

test.describe('Cardápio Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cardapio');
  });

  test('should display page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /cardápio/i })).toBeVisible();
  });

  test('should display category filters', async ({ page }) => {
    await expect(page.getByRole('button', { name: /todos/i })).toBeVisible();
  });

  test('should have search input', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar/i);
    await expect(searchInput).toBeVisible();
  });

  test('should filter products by search', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar/i);
    await searchInput.fill('cerveja');
    await page.waitForTimeout(500); // Debounce

    // Should show filtered results or empty state
    const resultsText = page.locator('text=/pratos encontrados|nenhum prato/i');
    await expect(resultsText).toBeVisible();
  });

  test('should open cart when clicking cart button', async ({ page }) => {
    await page.getByRole('button', { name: /carrinho/i }).click();
    await expect(page.getByText(/seu carrinho/i)).toBeVisible();
  });

  test('should show empty cart message initially', async ({ page }) => {
    await page.getByRole('button', { name: /carrinho/i }).click();
    await expect(page.getByText(/carrinho vazio/i)).toBeVisible();
  });

  test('should navigate back to home', async ({ page }) => {
    await page.getByRole('button', { name: /voltar/i }).click();
    await expect(page).toHaveURL('/');
  });
});
