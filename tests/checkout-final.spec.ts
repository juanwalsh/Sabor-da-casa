import { test, expect } from '@playwright/test';

test('checkout completo funciona', async ({ page }) => {
  // Injetar item no carrinho via localStorage
  await page.goto('/');
  await page.evaluate(() => {
    const cartData = {
      state: {
        items: [{
          product: {
            id: 'feijoada-1',
            name: 'Feijoada Completa',
            description: 'Feijoada tradicional',
            price: 49.90,
            image: 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=400',
            category: 'pratos-principais',
            available: true,
            stock: 100
          },
          quantity: 1
        }]
      },
      version: 0
    };
    localStorage.setItem('sabor-da-casa-cart', JSON.stringify(cartData));
  });

  // Ir para checkout
  await page.goto('/checkout');
  await page.waitForLoadState('networkidle');

  // Verificar que tem item no carrinho e botao visivel
  const confirmButton = page.locator('button:has-text("Confirmar Pedido")');
  await expect(confirmButton).toBeVisible({ timeout: 5000 });

  // Clicar para confirmar
  await confirmButton.click();

  // Aguardar resultado (sucesso ou erro)
  const success = page.locator('text=Pedido Confirmado');
  await expect(success).toBeVisible({ timeout: 15000 });
});

test('login admin esta acessivel', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('text=Bem-vindo de volta')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Painel Administrativo' })).toBeVisible();
  // Verifica que NAO tem opcoes de criar conta ou convidado
  await expect(page.locator('text=Criar Conta')).not.toBeVisible();
  await expect(page.locator('text=Convidado')).not.toBeVisible();
});
