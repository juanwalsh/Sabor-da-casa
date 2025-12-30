const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await context.newPage();

  console.log('=== VERIFICANDO ALTERACOES ===\n');

  // 1. Login
  console.log('1. TELA DE LOGIN');
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-results/check-login.png', fullPage: true });
  console.log('   Screenshot salva: test-results/check-login.png');

  // Verificar posicao do formulario
  const formCard = page.locator('.bg-card.border.rounded-2xl').first();
  if (await formCard.isVisible()) {
    const box = await formCard.boundingBox();
    const viewportWidth = 1400;
    const centerX = box.x + (box.width / 2);
    const screenCenterX = viewportWidth / 2;
    const offset = Math.abs(centerX - screenCenterX);
    console.log(`   Formulario: x=${box.x}, centro=${centerX.toFixed(0)}, centro tela=${screenCenterX}`);
    console.log(`   Offset do centro: ${offset.toFixed(0)}px`);
    if (offset < 100) {
      console.log('   STATUS: Formulario CENTRALIZADO corretamente!');
    } else {
      console.log('   STATUS: Formulario NAO centralizado (offset > 100px)');
    }
  }

  // 2. Login no admin
  console.log('\n2. FAZENDO LOGIN...');
  await page.fill('input[type="email"]', 'admin@sabordacasa.com.br');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  // 3. Produtos - verificar eixo Y
  console.log('\n3. PAGINA DE PRODUTOS - VERIFICANDO EIXO Y');
  await page.goto('http://localhost:3000/admin/produtos');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-results/check-produtos.png', fullPage: true });
  console.log('   Screenshot salva: test-results/check-produtos.png');

  // Verificar todas as imagens de produtos
  const productCards = page.locator('.relative.h-48.w-full');
  const count = await productCards.count();
  console.log(`   Total de cards com h-48: ${count}`);

  if (count > 0) {
    const firstCard = productCards.first();
    const box = await firstCard.boundingBox();
    console.log(`   Primeira imagem: altura=${box.height}px, largura=${box.width}px`);

    // Verificar se a imagem esta cobrindo todo o container
    const img = page.locator('.relative.h-48.w-full img').first();
    if (await img.isVisible()) {
      const imgBox = await img.boundingBox();
      console.log(`   Tag img: altura=${imgBox.height}px, largura=${imgBox.width}px`);

      if (imgBox.height >= box.height) {
        console.log('   STATUS: Imagem cobrindo eixo Y corretamente!');
      } else {
        console.log('   STATUS: PROBLEMA - Imagem NAO cobre todo o eixo Y');
      }
    }
  }

  // Verificar se tem aspect-ratio ainda em algum lugar
  const aspectRatio = page.locator('[class*="aspect-"]');
  const aspectCount = await aspectRatio.count();
  console.log(`\n   Elementos com aspect-ratio na pagina: ${aspectCount}`);

  console.log('\n=== VERIFICACAO CONCLUIDA ===');
  console.log('Veja as screenshots em test-results/\n');

  await page.waitForTimeout(5000);
  await browser.close();
})();
