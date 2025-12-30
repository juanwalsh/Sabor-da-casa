const { chromium } = require('playwright');

async function testFinalValidation() {
  console.log('=== VALIDACAO FINAL - ADMIN RESPONSIVO ===\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  const consoleWarnings = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    } else if (msg.type() === 'warning') {
      consoleWarnings.push(msg.text());
    }
  });

  const baseUrl = 'http://localhost:3000';
  const pages = ['/admin', '/admin/pedidos', '/admin/produtos', '/admin/usuarios'];
  const viewports = [
    { name: '320x556 (iPhone SE)', width: 320, height: 556 },
    { name: '375x667 (iPhone 8)', width: 375, height: 667 },
  ];

  let totalTests = 0;
  let passedTests = 0;

  // Login
  try {
    await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('input[type="email"]', 'admin@sabordacasa.com.br');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin**', { timeout: 10000 });
    console.log('Login: OK\n');
    passedTests++;
  } catch (e) {
    console.log('Login: FALHOU -', e.message);
    await browser.close();
    return;
  }
  totalTests++;

  // Testar cada pagina em cada viewport
  for (const vp of viewports) {
    console.log(`\n=== ${vp.name} ===\n`);
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const path of pages) {
      console.log(`--- ${path} ---`);
      totalTests++;

      try {
        await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(500);

        // 1. Verificar overflow horizontal
        const hasOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        console.log(`  Overflow horizontal: ${hasOverflow ? 'FALHOU' : 'OK'}`);
        if (!hasOverflow) passedTests++;
        totalTests++;

        // 2. Testar menu mobile
        const menuButton = await page.$('.lg\\:hidden button, button[aria-label="Abrir menu"]');
        if (menuButton) {
          await menuButton.click();
          await page.waitForTimeout(300);

          const sheet = await page.$('[data-slot="sheet-content"]');
          const sheetVisible = sheet ? await sheet.isVisible() : false;
          console.log(`  Menu abre: ${sheetVisible ? 'OK' : 'FALHOU'}`);
          if (sheetVisible) passedTests++;
          totalTests++;

          // Testar navegacao
          if (sheetVisible) {
            const navLinks = await page.$$('[data-slot="sheet-content"] nav a');
            if (navLinks.length > 1) {
              await navLinks[1].click();
              await page.waitForTimeout(500);

              // Verificar se o sheet fechou
              const sheetAfterNav = await page.$('[data-slot="sheet-content"]');
              const sheetStillOpen = sheetAfterNav ? await sheetAfterNav.isVisible() : false;
              console.log(`  Menu fecha apos navegacao: ${!sheetStillOpen ? 'OK' : 'FALHOU'}`);
              if (!sheetStillOpen) passedTests++;
              totalTests++;
            }
          }

          await page.keyboard.press('Escape');
          await page.waitForTimeout(200);
        }

      } catch (e) {
        console.log(`  Erro: ${e.message}`);
      }
    }
  }

  // Resumo de erros
  console.log('\n\n=== RESUMO DE ERROS DO CONSOLE ===\n');

  // Filtrar erros relevantes (excluir Next.js internals)
  const relevantErrors = consoleErrors.filter(e =>
    !e.includes('Failed to load resource') &&
    !e.includes('net::')
  );

  if (relevantErrors.length > 0) {
    console.log(`Erros encontrados: ${relevantErrors.length}`);
    relevantErrors.slice(0, 5).forEach((err, i) => {
      console.log(`  ${i + 1}. ${err.substring(0, 150)}...`);
    });
  } else {
    console.log('Nenhum erro relevante no console!');
  }

  // Resumo final
  console.log('\n\n=== RESULTADO FINAL ===\n');
  const percentage = Math.round((passedTests / totalTests) * 100);
  console.log(`Testes passados: ${passedTests}/${totalTests} (${percentage}%)`);
  console.log(`Status: ${percentage >= 80 ? 'APROVADO' : 'REPROVADO'}`);

  await browser.close();
  console.log('\n=== TESTE CONCLUIDO ===');
}

testFinalValidation().catch(console.error);
