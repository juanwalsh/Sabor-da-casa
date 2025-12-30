const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();

  console.log('=== TESTE SIMPLES MENU ADMIN ===\n');

  // Login
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(1000);
  await page.fill('input[type="email"]', 'admin@sabordacasa.com.br');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  console.log('1. No Dashboard');
  console.log(`   URL: ${page.url()}`);

  // Abrir menu
  console.log('\n2. Abrindo menu...');
  await page.click('button:has(svg.lucide-menu)');
  await page.waitForTimeout(1000);

  // Verificar conteudo do Sheet
  const sheetContent = page.locator('[role="dialog"]');
  const sheetVisible = await sheetContent.isVisible();
  console.log(`   Sheet visivel: ${sheetVisible}`);

  if (sheetVisible) {
    // Listar todos os links no sheet
    const links = await page.locator('[role="dialog"] a').all();
    console.log(`   Links encontrados no sheet: ${links.length}`);

    for (let i = 0; i < links.length; i++) {
      const href = await links[i].getAttribute('href');
      const text = await links[i].innerText().catch(() => '');
      console.log(`     ${i+1}. ${text} -> ${href}`);
    }

    // Tentar clicar no link de Pedidos
    console.log('\n3. Clicando em Pedidos...');
    const pedidosLink = page.locator('[role="dialog"] a[href="/admin/pedidos"]');
    if (await pedidosLink.isVisible()) {
      await pedidosLink.click({ force: true });
      await page.waitForTimeout(1500);
      console.log(`   URL apos clique: ${page.url()}`);
      await page.screenshot({ path: 'test-results/after-pedidos-click.png' });
    } else {
      console.log('   Link de Pedidos nao visivel');
    }
  }

  // Navegar diretamente para testar as paginas
  console.log('\n4. Testando navegacao direta...');

  await page.goto('http://localhost:3000/admin/pedidos');
  await page.waitForTimeout(1000);
  console.log(`   Pedidos: ${page.url()}`);
  await page.screenshot({ path: 'test-results/direct-pedidos.png', fullPage: true });

  await page.goto('http://localhost:3000/admin/usuarios');
  await page.waitForTimeout(1000);
  console.log(`   Usuarios: ${page.url()}`);
  await page.screenshot({ path: 'test-results/direct-usuarios.png', fullPage: true });

  console.log('\n=== FIM ===\n');

  await page.waitForTimeout(3000);
  await browser.close();
})();
