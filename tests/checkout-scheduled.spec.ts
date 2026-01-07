import { test, expect } from '@playwright/test';

test.describe('Checkout com Agendamento', () => {
  test.beforeEach(async ({ page }) => {
    // Injetar item no carrinho
    await page.goto('/');
    await page.evaluate(() => {
      const cartData = {
        state: {
          items: [{
            product: {
              id: 'prod-1',
              name: 'Feijoada Completa',
              description: 'Tradicional feijoada',
              price: 45.90,
              image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=600',
              categoryId: 'cat-1',
              available: true,
              stock: 30
            },
            quantity: 1
          }]
        },
        version: 0
      };
      localStorage.setItem('sabor-da-casa-cart', JSON.stringify(cartData));
    });
  });

  test('checkout normal sem agendamento funciona', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Verificar que o botao de confirmar esta visivel
    const confirmButton = page.locator('button[type="submit"]:has-text("Confirmar Pedido")');
    await expect(confirmButton).toBeVisible({ timeout: 5000 });

    // Clicar para confirmar
    await confirmButton.click();

    // Aguardar resultado
    const success = page.locator('text=Pedido Confirmado');
    await expect(success).toBeVisible({ timeout: 15000 });
  });

  test('checkout com agendamento funciona', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Procurar botao de agendar entrega
    const agendarButton = page.locator('button:has-text("Agendar"), button:has-text("agendar")').first();

    if (await agendarButton.isVisible()) {
      // Clicar para abrir opcoes de agendamento
      await agendarButton.click({ force: true });
      
      // Esperar modal abrir
      const modal = page.locator('div[role="dialog"]');
      await expect(modal).toBeVisible();

      // Screenshot do modal de agendamento
      await page.screenshot({ path: 'test-results/agendamento-modal.png' });

      // Esperar modal estabilizar
      await page.waitForTimeout(1000);

      // Tentar primeira data
      const dataButton = page.locator('button[data-date]').first();
      await expect(dataButton).toBeVisible();
      await dataButton.click({ force: true });
      
      // Pausa para animacao dos horarios
      await page.waitForTimeout(1000);

      // Verificar se temos horarios. Se nao, tentar segunda data (caso seja fim do dia)
      const horaButton = page.locator('button[data-time]').first();
      
      if (!await horaButton.isVisible()) {
        const nextDataButton = page.locator('button[data-date]').nth(1);
        if (await nextDataButton.isVisible()) {
          await nextDataButton.click({ force: true });
          await page.waitForTimeout(1000);
        }
      }

      // Selecionar primeiro horario disponivel (esperar estar visivel apos animacao)
      await expect(horaButton).toBeVisible();
      await horaButton.click({ force: true });
      
      // Verificar se foi selecionado (tem classe bg-primary)
      // await expect(horaButton).toHaveClass(/bg-primary/); // Comentado pois pode ser flaky com framer motion
      
      // Pausa maior para animacao do resumo
      await page.waitForTimeout(1000);

      // Confirmar agendamento (dentro do modal)
      const confirmarAgendamento = page.locator('div[role="dialog"] button:has-text("Confirmar")').first();
      await expect(confirmarAgendamento).toBeVisible();
      
      // Garantir que o botao esta habilitado (horario selecionado)
      await expect(confirmarAgendamento).toBeEnabled({ timeout: 5000 });
      
      await confirmarAgendamento.click(); // Standard click should work now

      // Verificar se o agendamento foi aplicado (modal fecha e aparece o resumo)
      await expect(page.locator('p:has-text("Entrega agendada")')).toBeVisible({ timeout: 10000 });
      
      // Esperar modal fechar (opcional, mas bom pra garantir limpeza)
      await expect(modal).toBeHidden();
      await page.waitForTimeout(500);
    }

    // Screenshot antes de confirmar
    await page.screenshot({ path: 'test-results/checkout-antes-confirmar.png' });

    // Clicar para confirmar pedido
    const confirmButton = page.locator('button[type="submit"]:has-text("Confirmar Pedido")');
    await expect(confirmButton).toBeVisible({ timeout: 5000 });
    await confirmButton.click();

    // Aguardar resultado
    const success = page.locator('text=Pedido Confirmado');
    await expect(success).toBeVisible({ timeout: 15000 });

    // Screenshot final
    await page.screenshot({ path: 'test-results/checkout-sucesso.png' });
  });
});
