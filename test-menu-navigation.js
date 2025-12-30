const { chromium } = require('playwright');

async function testMenuNavigation() {
  console.log('=== TESTE DETALHADO DO MENU MOBILE ===\n');

  const browser = await chromium.launch({ headless: false }); // headless false para visualizar
  const context = await browser.newContext({
    viewport: { width: 320, height: 556 }
  });
  const page = await context.newPage();

  const baseUrl = 'http://localhost:3000';

  // Login
  try {
    await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('input[type="email"]', 'admin@sabordacasa.com.br');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin**', { timeout: 10000 });
    console.log('Login OK\n');
  } catch (e) {
    console.log('Erro no login:', e.message);
    await browser.close();
    return;
  }

  // Teste de cliques no menu
  console.log('Testando navegacao do menu mobile...\n');

  for (let i = 0; i < 3; i++) {
    console.log(`--- Tentativa ${i + 1} ---`);

    // Localizar botao do menu
    const menuButton = await page.$('button.lg\\:hidden');
    if (!menuButton) {
      console.log('Botao do menu nao encontrado!');
      continue;
    }

    console.log('1. Clicando no botao do menu...');
    await menuButton.click();
    await page.waitForTimeout(500);

    // Verificar se o sheet abriu
    const sheet = await page.$('[data-slot="sheet-content"]');
    if (!sheet) {
      console.log('   Sheet NAO abriu!');
      continue;
    }

    const sheetVisible = await sheet.isVisible();
    console.log(`   Sheet visivel: ${sheetVisible}`);

    // Localizar links de navegacao
    const navLinks = await sheet.$$('nav a');
    console.log(`   Links no menu: ${navLinks.length}`);

    if (navLinks.length > 1) {
      // Tentar clicar em "Pedidos"
      console.log('2. Tentando navegar para Pedidos...');
      try {
        await navLinks[1].click();
        await page.waitForTimeout(1000);
        const currentUrl = page.url();
        console.log(`   URL atual: ${currentUrl}`);

        if (currentUrl.includes('/pedidos')) {
          console.log('   Navegacao FUNCIONOU!\n');
        } else {
          console.log('   Navegacao FALHOU - URL nao mudou\n');
        }
      } catch (e) {
        console.log(`   Erro ao clicar: ${e.message}\n`);
      }
    }

    await page.waitForTimeout(500);
  }

  // Tirar screenshot
  await page.screenshot({ path: 'test-results/menu-test.png', fullPage: true });
  console.log('Screenshot salvo em test-results/menu-test.png');

  await browser.close();
  console.log('\n=== TESTE CONCLUIDO ===');
}

testMenuNavigation().catch(console.error);
