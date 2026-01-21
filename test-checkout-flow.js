const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Iniciando teste do fluxo de checkout...\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // 1. Abrir página inicial
    console.log('1️⃣ Abrindo página inicial...');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    // 2. Adicionar produto ao carrinho (clicar no primeiro produto)
    console.log('2️⃣ Adicionando produto ao carrinho...');
    const firstProduct = await page.locator('[data-testid="product-card"], .product-card, button:has-text("Adicionar")').first();
    if (await firstProduct.count() > 0) {
      await firstProduct.click();
      await page.waitForTimeout(1000);
    } else {
      // Tentar ir direto pro cardápio
      await page.goto('http://localhost:3000/cardapio');
      await page.waitForTimeout(2000);
      await page.locator('button:has-text("Adicionar")').first().click();
      await page.waitForTimeout(1000);
    }

    // 3. Abrir carrinho
    console.log('3️⃣ Abrindo carrinho...');
    await page.locator('[aria-label="Carrinho"], button:has-text("Carrinho"), [data-testid="cart-button"]').click();
    await page.waitForTimeout(1500);

    // 4. Ir para checkout
    console.log('4️⃣ Indo para checkout...');
    await page.locator('button:has-text("Finalizar"), button:has-text("Checkout")').click();
    await page.waitForTimeout(2000);

    // 5. Preencher formulário
    console.log('5️⃣ Preenchendo formulário...');
    await page.fill('input[name="name"], input[placeholder*="nome"]', 'Teste Automatizado');
    await page.fill('input[name="phone"], input[placeholder*="telefone"]', '11999999999');
    await page.fill('input[name="address"], input[placeholder*="endereço"]', 'Rua Teste, 123');

    // 6. Selecionar PIX
    console.log('6️⃣ Selecionando PIX...');
    await page.locator('[value="pix"], input[id="pix"]').check();
    await page.waitForTimeout(500);

    // 7. Finalizar pedido
    console.log('7️⃣ Finalizando pedido...');
    await page.locator('button:has-text("Finalizar Pedido"), button[type="submit"]').click();
    await page.waitForTimeout(3000);

    // 8. Verificar se modal de pagamento abriu
    console.log('8️⃣ Verificando modal de pagamento...');
    const modalVisible = await page.locator('[role="dialog"], .modal, div:has-text("Mercado Pago")').count() > 0;
    
    if (modalVisible) {
      console.log('✅ Modal de pagamento abriu!');

      // Verificar se tem botão de pagamento
      const paymentButton = await page.locator('button:has-text("Pagar"), button:has-text("Mercado Pago")');
      if (await paymentButton.count() > 0) {
        console.log('✅ Botão de pagamento encontrado!');
        
        // Tirar screenshot
        await page.screenshot({ path: 'C:/Users/Pichau/Desktop/restaurante/checkout-success.png' });
        console.log('📸 Screenshot salva em checkout-success.png');
        
        console.log('\n🎉 TESTE COMPLETO! Integração funcionando.');
      } else {
        console.log('⚠️ Botão de pagamento não encontrado no modal');
        await page.screenshot({ path: 'C:/Users/Pichau/Desktop/restaurante/checkout-error.png' });
      }
    } else {
      console.log('❌ Modal de pagamento não abriu');
      await page.screenshot({ path: 'C:/Users/Pichau/Desktop/restaurante/checkout-failed.png' });
    }

    await page.waitForTimeout(5000);

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    await page.screenshot({ path: 'C:/Users/Pichau/Desktop/restaurante/test-error.png' });
  } finally {
    await browser.close();
  }
})();
