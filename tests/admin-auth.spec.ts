import { test, expect } from '@playwright/test';

test.describe('Admin Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /login|entrar|acesso/i })).toBeVisible();
  });

  test('should have username and password fields', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel(/usuário|email|login/i)).toBeVisible();
    await expect(page.getByLabel(/senha|password/i)).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel(/usuário|email|login/i).fill('wrong');
    await page.getByLabel(/senha|password/i).fill('wrong');
    await page.getByRole('button', { name: /entrar|login|acessar/i }).click();

    await page.waitForTimeout(1000);

    // Should show error or stay on login page
    await expect(page).toHaveURL(/login/);
  });

  test('should redirect to login when accessing admin without auth', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/login/);
  });

  test('should redirect to login when accessing admin/pedidos without auth', async ({ page }) => {
    await page.goto('/admin/pedidos');
    await expect(page).toHaveURL(/login/);
  });

  test('should redirect to login when accessing admin/produtos without auth', async ({ page }) => {
    await page.goto('/admin/produtos');
    await expect(page).toHaveURL(/login/);
  });
});
