const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const page = await context.newPage();

  console.log('=== VERIFICACAO FINAL ===\n');

  // 1. LOGIN
  console.log('1. VERIFICANDO LOGIN...');
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-results/final-login.png', fullPage: true });
  console.log('   Screenshot: test-results/final-login.png');

  // Medir posicoes
  const formCard = page.locator('.bg-card.border.rounded-2xl').first();

  if (await formCard.isVisible()) {
    const formBox = await formCard.boundingBox();
    const screenCenter = 1600 / 2;
    const formCenter = formBox.x + formBox.width / 2;
    console.log(`   Form center: ${formCenter.toFixed(0)}px, Screen center: ${screenCenter}px`);
    console.log(`   Offset: ${Math.abs(formCenter - screenCenter).toFixed(0)}px`);
  }

  // 2. FAZER LOGIN
  console.log('\n2. FAZENDO LOGIN...');
  await page.fill('input[type="email"]', 'admin@sabordacasa.com.br');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2500);

  // 3. PRODUTOS
  console.log('\n3. VERIFICANDO PRODUTOS...');
  await page.goto('http://localhost:3000/admin/produtos');
  await page.waitForTimeout(2000);

  // Screenshot da pagina completa
  await page.screenshot({ path: 'test-results/final-produtos.png', fullPage: true });
  console.log('   Screenshot: test-results/final-produtos.png');

  // Pegar o primeiro card de produto com imagem
  const productCard = page.locator('.overflow-hidden:has(.relative.h-48)').first();
  if (await productCard.isVisible()) {
    await productCard.screenshot({ path: 'test-results/final-card-produto.png' });
    console.log('   Screenshot card: test-results/final-card-produto.png');

    const cardBox = await productCard.boundingBox();
    console.log(`   Card size: ${cardBox.width.toFixed(0)}x${cardBox.height.toFixed(0)}px`);
  }

  // Verificar container de imagem
  const imgContainer = page.locator('.relative.h-48.w-full').first();
  if (await imgContainer.isVisible()) {
    const imgBox = await imgContainer.boundingBox();
    console.log(`   Image container: ${imgBox.width.toFixed(0)}x${imgBox.height.toFixed(0)}px`);

    // Screenshot do container de imagem
    await imgContainer.screenshot({ path: 'test-results/final-img-container.png' });
    console.log('   Screenshot container: test-results/final-img-container.png');
  }

  console.log('\n=== VERIFICACAO CONCLUIDA ===');
  console.log('Screenshots em test-results/\n');

  await page.waitForTimeout(5000);
  await browser.close();
})();
