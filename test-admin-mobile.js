const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();

  console.log('=== TESTE ADMIN MOBILE ===\n');

  // 1. Login
  console.log('1. FAZENDO LOGIN...');
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(1500);
  await page.fill('input[type="email"]', 'admin@sabordacasa.com.br');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2500);

  // 2. Testar menu mobile
  console.log('\n2. TESTANDO MENU MOBILE NO DASHBOARD...');
  await page.screenshot({ path: 'test-results/admin-mobile-dashboard.png', fullPage: true });

  // Procurar botão do menu hamburger
  const menuButton = page.locator('button:has(svg.lucide-menu)').first();
  const menuButtonVisible = await menuButton.isVisible();
  console.log(`   Botao menu hamburger visivel: ${menuButtonVisible}`);

  if (menuButtonVisible) {
    console.log('   Clicando no menu...');
    await menuButton.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/admin-mobile-menu-open.png' });
    console.log('   Screenshot: test-results/admin-mobile-menu-open.png');

    // Verificar se o menu abriu
    const sidebar = page.locator('[data-state="open"]');
    const sidebarOpen = await sidebar.isVisible().catch(() => false);
    console.log(`   Menu aberto: ${sidebarOpen}`);

    // Tentar clicar em Pedidos
    const pedidosLink = page.locator('a:has-text("Pedidos")').first();
    if (await pedidosLink.isVisible()) {
      console.log('   Clicando em Pedidos...');
      await pedidosLink.click();
      await page.waitForTimeout(1500);
      console.log(`   URL atual: ${page.url()}`);
    }
  } else {
    console.log('   ERRO: Botao do menu nao encontrado!');
  }

  // 3. Testar página de usuários
  console.log('\n3. TESTANDO PAGINA DE USUARIOS...');
  await page.goto('http://localhost:3000/admin/usuarios');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-results/admin-mobile-usuarios.png', fullPage: true });
  console.log('   Screenshot: test-results/admin-mobile-usuarios.png');

  // Verificar overflow
  const hasOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  console.log(`   Overflow horizontal: ${hasOverflow}`);

  // Verificar elementos cortados
  const cutElements = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const elements = document.querySelectorAll('button, input, .card, [class*="Card"]');
    const cut = [];
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth) {
        cut.push({
          tag: el.tagName,
          class: el.className?.substring(0, 50),
          overflow: (rect.right - docWidth).toFixed(0)
        });
      }
    });
    return cut;
  });

  if (cutElements.length > 0) {
    console.log('   Elementos cortados:');
    cutElements.forEach(el => {
      console.log(`     - <${el.tag}> overflow: ${el.overflow}px`);
    });
  }

  // 4. Testar scroll e interações
  console.log('\n4. TESTANDO INTERACOES...');

  // Verificar se os cards de usuario estao visiveis
  const userCards = page.locator('.overflow-hidden').first();
  if (await userCards.isVisible()) {
    console.log('   Cards de usuario visiveis: SIM');
    const cardBox = await userCards.boundingBox();
    console.log(`   Card size: ${cardBox.width.toFixed(0)}x${cardBox.height.toFixed(0)}px`);

    if (cardBox.width > 375) {
      console.log('   PROBLEMA: Card maior que a tela!');
    }
  }

  // 5. Testar outras páginas admin
  console.log('\n5. TESTANDO OUTRAS PAGINAS ADMIN...');

  // Pedidos
  await page.goto('http://localhost:3000/admin/pedidos');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'test-results/admin-mobile-pedidos.png', fullPage: true });
  console.log('   Pedidos: OK');

  // Produtos
  await page.goto('http://localhost:3000/admin/produtos');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'test-results/admin-mobile-produtos.png', fullPage: true });
  console.log('   Produtos: OK');

  console.log('\n=== TESTE CONCLUIDO ===');
  console.log('Verifique as screenshots em test-results/\n');

  await page.waitForTimeout(3000);
  await browser.close();
})();
