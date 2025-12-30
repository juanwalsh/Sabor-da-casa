const { chromium } = require('playwright');

async function testAdminResponsiveness() {
  console.log('=== TESTE DE RESPONSIVIDADE E ERROS NO ADMIN ===\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  const consoleWarnings = [];

  // Capturar erros do console
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    } else if (msg.type() === 'warning') {
      consoleWarnings.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(`Page Error: ${err.message}`);
  });

  const baseUrl = 'http://localhost:3000';
  const pages = ['/admin', '/admin/pedidos', '/admin/produtos', '/admin/usuarios'];
  const viewports = [
    { name: '320x556 (iPhone SE)', width: 320, height: 556 },
    { name: '375x667 (iPhone 8)', width: 375, height: 667 },
    { name: '390x844 (iPhone 12)', width: 390, height: 844 },
  ];

  console.log('1. ERROS DO CONSOLE\n');

  // Primeiro, fazer login
  try {
    await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('input[type="email"]', 'admin@sabordacasa.com.br');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin**', { timeout: 10000 });
    console.log('Login realizado com sucesso!\n');
  } catch (e) {
    console.log('Erro no login ou servidor nao esta rodando:', e.message);
    await browser.close();
    return;
  }

  // Testar cada pagina
  for (const path of pages) {
    console.log(`\n--- Testando ${path} ---`);

    try {
      await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1000);

      // Testar em cada viewport
      for (const vp of viewports) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.waitForTimeout(500);

        // Verificar menu mobile
        const menuButton = await page.$('button:has([data-lucide="menu"]), button:has(svg.lucide-menu), .lg\\:hidden button');
        if (menuButton) {
          const isVisible = await menuButton.isVisible();
          console.log(`  ${vp.name}: Menu button visivel = ${isVisible}`);

          if (isVisible) {
            try {
              await menuButton.click();
              await page.waitForTimeout(300);

              // Verificar se o Sheet abriu
              const sheet = await page.$('[data-slot="sheet-content"], [role="dialog"]');
              const sheetVisible = sheet ? await sheet.isVisible() : false;
              console.log(`  ${vp.name}: Sheet/Menu aberto = ${sheetVisible}`);

              // Fechar o sheet
              await page.keyboard.press('Escape');
              await page.waitForTimeout(300);
            } catch (e) {
              console.log(`  ${vp.name}: Erro ao clicar no menu: ${e.message}`);
            }
          }
        }

        // Verificar overflow horizontal
        const hasHorizontalOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        console.log(`  ${vp.name}: Overflow horizontal = ${hasHorizontalOverflow}`);
      }
    } catch (e) {
      console.log(`Erro ao testar ${path}: ${e.message}`);
    }
  }

  console.log('\n\n2. RESUMO DE ERROS DO CONSOLE\n');

  if (consoleErrors.length > 0) {
    console.log('ERROS:');
    consoleErrors.forEach((err, i) => {
      console.log(`  ${i + 1}. ${err.substring(0, 200)}`);
    });
  } else {
    console.log('Nenhum erro no console!');
  }

  if (consoleWarnings.length > 0) {
    console.log('\nWARNINGS:');
    consoleWarnings.slice(0, 10).forEach((warn, i) => {
      console.log(`  ${i + 1}. ${warn.substring(0, 200)}`);
    });
  }

  await browser.close();
  console.log('\n=== TESTE CONCLUIDO ===');
}

testAdminResponsiveness().catch(console.error);
