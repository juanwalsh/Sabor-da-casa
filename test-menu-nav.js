const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();

  console.log('=== TESTE NAVEGACAO MENU ADMIN MOBILE ===\n');

  // Login
  console.log('1. Fazendo login...');
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(1500);
  await page.fill('input[type="email"]', 'admin@sabordacasa.com.br');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2500);
  console.log(`   URL apos login: ${page.url()}`);

  // Testar navegacao pelo menu
  const menuTests = [
    { name: 'Pedidos', expectedUrl: '/admin/pedidos' },
    { name: 'Produtos', expectedUrl: '/admin/produtos' },
    { name: 'Usuarios', expectedUrl: '/admin/usuarios' },
    { name: 'Dashboard', expectedUrl: '/admin' }
  ];

  for (const test of menuTests) {
    console.log(`\n2. Testando navegacao para ${test.name}...`);

    // Abrir menu
    const menuButton = page.locator('button:has(svg.lucide-menu)').first();
    await menuButton.click();
    await page.waitForTimeout(800);

    // Clicar no link
    const link = page.locator(`a:has-text("${test.name}")`).first();
    const linkVisible = await link.isVisible();
    console.log(`   Link "${test.name}" visivel: ${linkVisible}`);

    if (linkVisible) {
      await link.click();
      await page.waitForTimeout(1500);
      const currentUrl = page.url();
      const success = currentUrl.includes(test.expectedUrl);
      console.log(`   URL atual: ${currentUrl}`);
      console.log(`   Navegacao ${success ? 'OK' : 'FALHOU'}`);

      if (!success) {
        await page.screenshot({ path: `test-results/nav-fail-${test.name.toLowerCase()}.png` });
      }
    } else {
      console.log(`   ERRO: Link nao encontrado`);
    }
  }

  // Verificar se o conteudo muda em cada pagina
  console.log('\n3. Verificando conteudo das paginas...');

  // Dashboard
  await page.goto('http://localhost:3000/admin');
  await page.waitForTimeout(1000);
  const dashboardContent = await page.locator('text=Pedidos Hoje').isVisible();
  console.log(`   Dashboard tem "Pedidos Hoje": ${dashboardContent}`);

  // Pedidos
  await page.goto('http://localhost:3000/admin/pedidos');
  await page.waitForTimeout(1000);
  const pedidosContent = await page.locator('text=Gerenciar Pedidos').isVisible() ||
                         await page.locator('text=pedidos').first().isVisible();
  console.log(`   Pedidos carregou: ${pedidosContent}`);
  await page.screenshot({ path: 'test-results/admin-pedidos-mobile.png', fullPage: true });

  // Produtos
  await page.goto('http://localhost:3000/admin/produtos');
  await page.waitForTimeout(1000);
  const produtosContent = await page.locator('text=Produtos').first().isVisible();
  console.log(`   Produtos carregou: ${produtosContent}`);

  // Usuarios
  await page.goto('http://localhost:3000/admin/usuarios');
  await page.waitForTimeout(1000);
  const usuariosContent = await page.locator('text=Usuarios').first().isVisible();
  console.log(`   Usuarios carregou: ${usuariosContent}`);

  console.log('\n=== TESTE CONCLUIDO ===\n');

  await page.waitForTimeout(2000);
  await browser.close();
})();
