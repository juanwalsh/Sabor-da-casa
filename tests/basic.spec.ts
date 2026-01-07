import { test, expect } from '@playwright/test';

test.describe('Paginas Principais', () => {
  test('home page carrega corretamente', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Sabor da Casa/);
    // Usar locator mais especifico - header da navbar
    await expect(page.locator('header').first()).toBeVisible();
  });

  test('cardapio carrega produtos', async ({ page }) => {
    await page.goto('/cardapio');
    // O titulo usa "Cardapio" sem acento
    await expect(page.getByRole('heading', { name: /Cardápio/i })).toBeVisible();
    // Verificar se produtos aparecem
    await expect(page.locator('text=Feijoada Completa')).toBeVisible({ timeout: 10000 });
  });

  test('login page carrega', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('text=Bem-vindo de volta')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});

test.describe('Carrinho de Compras', () => {
  test('adiciona item ao carrinho', async ({ page }) => {
    await page.goto('/cardapio');

    // Esperar produtos carregarem
    await page.waitForSelector('text=Feijoada Completa', { timeout: 10000 });

    // Clicar no botao adicionar do primeiro produto
    const addButton = page.locator('button:has-text("Adicionar")').first();
    await addButton.click();

    // Verificar toast de sucesso
    await expect(page.locator('text=adicionado')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Responsividade Mobile', () => {
  test('navegacao mobile funciona', async ({ page }) => {
    // Usar viewport mobile
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    // Verificar se header aparece
    await expect(page.locator('header').first()).toBeVisible();
  });

  test('cardapio mobile carrega', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/cardapio');

    // Verificar se header com titulo aparece
    await expect(page.getByRole('heading', { name: /Cardápio/i })).toBeVisible();
  });
});

test.describe('Checkout', () => {
  test('checkout sem itens mostra mensagem', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page.locator('text=Carrinho vazio')).toBeVisible();
  });
});
