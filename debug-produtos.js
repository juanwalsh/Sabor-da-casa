const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const page = await context.newPage();

  console.log('=== DEBUG PRODUTOS EIXO Y ===\n');

  // Login
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(1500);

  // Screenshot do login corrigido
  await page.screenshot({ path: 'test-results/debug-login.png', fullPage: true });
  console.log('1. Login screenshot: test-results/debug-login.png');

  await page.fill('input[type="email"]', 'admin@sabordacasa.com.br');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  // Ir para produtos
  await page.goto('http://localhost:3000/admin/produtos');
  await page.waitForTimeout(2000);

  // Screenshot em tamanho maior
  await page.screenshot({ path: 'test-results/debug-produtos-full.png', fullPage: true });
  console.log('2. Produtos full screenshot: test-results/debug-produtos-full.png');

  // Analisar os cards de produto
  console.log('\n=== ANALISE DOS CARDS ===');

  // Verificar estrutura do primeiro card
  const firstCard = page.locator('.overflow-hidden').first();
  const cardBox = await firstCard.boundingBox();
  console.log(`Card container: ${cardBox?.width}x${cardBox?.height}px`);

  // Verificar container da imagem
  const imageContainers = await page.locator('.relative.h-48').all();
  console.log(`\nContainers com h-48: ${imageContainers.length}`);

  if (imageContainers.length > 0) {
    const firstContainer = imageContainers[0];
    const containerBox = await firstContainer.boundingBox();
    console.log(`Primeiro container: ${containerBox?.width}x${containerBox?.height}px`);
  }

  // Verificar se ainda existe aspect-ratio em algum lugar
  const aspectElements = await page.locator('[class*="aspect"]').all();
  console.log(`\nElementos com 'aspect' na classe: ${aspectElements.length}`);

  for (let i = 0; i < Math.min(aspectElements.length, 5); i++) {
    const className = await aspectElements[i].getAttribute('class');
    console.log(`  - ${className}`);
  }

  // Tirar screenshot de um card especifico
  const productCard = page.locator('.grid > div').first();
  await productCard.screenshot({ path: 'test-results/debug-single-card.png' });
  console.log('\n3. Single card screenshot: test-results/debug-single-card.png');

  // Verificar CSS computado
  const imgContainer = page.locator('.relative.h-48.w-full').first();
  if (await imgContainer.isVisible()) {
    const height = await imgContainer.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        height: styles.height,
        minHeight: styles.minHeight,
        maxHeight: styles.maxHeight,
        aspectRatio: styles.aspectRatio
      };
    });
    console.log('\nCSS computado do container:');
    console.log(`  height: ${height.height}`);
    console.log(`  min-height: ${height.minHeight}`);
    console.log(`  max-height: ${height.maxHeight}`);
    console.log(`  aspect-ratio: ${height.aspectRatio}`);
  }

  console.log('\n=== DEBUG CONCLUIDO ===\n');

  await page.waitForTimeout(5000);
  await browser.close();
})();
