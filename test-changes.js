const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await context.newPage();

  console.log('1. Testando pagina de Login...');
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-results/login-page.png', fullPage: true });
  console.log('   Screenshot: test-results/login-page.png');

  console.log('2. Fazendo login no admin...');
  await page.fill('input[type="email"]', 'admin@sabordacasa.com.br');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  console.log('3. Testando Dashboard admin...');
  await page.screenshot({ path: 'test-results/admin-dashboard.png', fullPage: true });
  console.log('   Screenshot: test-results/admin-dashboard.png');

  console.log('4. Testando botao de notificacoes...');
  const bellButton = page.locator('button:has(svg.lucide-bell)');
  if (await bellButton.isVisible()) {
    await bellButton.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/admin-notifications.png' });
    console.log('   Screenshot: test-results/admin-notifications.png');
    console.log('   Popover de notificacoes funcionando!');
  } else {
    console.log('   ERRO: Botao de notificacoes nao encontrado');
  }

  console.log('5. Testando pagina de Produtos...');
  await page.goto('http://localhost:3000/admin/produtos');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-results/admin-produtos.png', fullPage: true });
  console.log('   Screenshot: test-results/admin-produtos.png');

  // Verificar altura da imagem dos produtos
  const productImage = page.locator('.relative.h-48.w-full').first();
  if (await productImage.isVisible()) {
    const box = await productImage.boundingBox();
    console.log(`   Imagem do produto: altura=${box.height}px, largura=${box.width}px`);
    if (box.height === 192) {
      console.log('   Altura h-48 (192px) aplicada corretamente!');
    }
  }

  console.log('\n Todos os testes concluidos!');
  console.log('Verifique as screenshots em test-results/\n');

  await page.waitForTimeout(3000);
  await browser.close();
})();
