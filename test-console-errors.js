const { chromium } = require('playwright');

async function testConsoleErrors() {
  console.log('=== VERIFICACAO DE ERROS NO CONSOLE ===\n');

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

  // Login
  try {
    await page.setViewportSize({ width: 320, height: 556 });
    await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('input[type="email"]', 'admin@sabordacasa.com.br');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin**', { timeout: 10000 });
    console.log('Login: OK\n');
  } catch (e) {
    console.log('Login: FALHOU -', e.message);
    await browser.close();
    return;
  }

  // Navegar por todas as paginas e interagir com menus
  const pages = ['/admin', '/admin/pedidos', '/admin/produtos', '/admin/usuarios'];

  for (const path of pages) {
    console.log(`Testando ${path}...`);
    await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(500);

    // Abrir e fechar menu mobile
    const menuButton = await page.$('button[aria-label="Abrir menu"]');
    if (menuButton) {
      await menuButton.click();
      await page.waitForTimeout(300);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
    }
  }

  console.log('\n=== ERROS DO CONSOLE ===\n');

  if (consoleErrors.length > 0) {
    // Categorizar erros
    const dialogErrors = consoleErrors.filter(e => e.includes('DialogContent') || e.includes('DialogTitle'));
    const chartErrors = consoleErrors.filter(e => e.includes('width') || e.includes('height'));
    const otherErrors = consoleErrors.filter(e =>
      !e.includes('DialogContent') &&
      !e.includes('DialogTitle') &&
      !e.includes('width') &&
      !e.includes('height')
    );

    if (dialogErrors.length > 0) {
      console.log(`Erros de Dialog/Sheet (acessibilidade): ${dialogErrors.length}`);
    }
    if (chartErrors.length > 0) {
      console.log(`Erros de graficos: ${chartErrors.length}`);
    }
    if (otherErrors.length > 0) {
      console.log(`Outros erros: ${otherErrors.length}`);
      otherErrors.forEach((err, i) => {
        console.log(`  ${i + 1}. ${err.substring(0, 200)}`);
      });
    }

    console.log(`\nTotal de erros: ${consoleErrors.length}`);
  } else {
    console.log('NENHUM ERRO NO CONSOLE!');
  }

  console.log('\n=== WARNINGS DO CONSOLE ===\n');

  if (consoleWarnings.length > 0) {
    const chartWarnings = consoleWarnings.filter(e => e.includes('width') || e.includes('height'));
    console.log(`Warnings de graficos: ${chartWarnings.length}`);
    console.log(`Total de warnings: ${consoleWarnings.length}`);
  } else {
    console.log('Nenhum warning!');
  }

  await browser.close();
  console.log('\n=== TESTE CONCLUIDO ===');
}

testConsoleErrors().catch(console.error);
