const { chromium } = require('playwright');

const viewports = {
  mobile: { width: 375, height: 812, name: 'Mobile (iPhone)' },
  tablet: { width: 768, height: 1024, name: 'Tablet (iPad)' },
  desktop: { width: 1440, height: 900, name: 'Desktop' }
};

const pages = [
  { path: '/', name: 'Home' },
  { path: '/cardapio', name: 'Cardapio' },
  { path: '/checkout', name: 'Checkout' },
  { path: '/login', name: 'Login' },
  { path: '/faq', name: 'FAQ' },
  { path: '/blog', name: 'Blog' },
  { path: '/carreiras', name: 'Carreiras' },
  { path: '/entrega', name: 'Entrega' },
  { path: '/termos', name: 'Termos' },
  { path: '/privacidade', name: 'Privacidade' }
];

const adminPages = [
  { path: '/admin', name: 'Admin Dashboard' },
  { path: '/admin/pedidos', name: 'Admin Pedidos' },
  { path: '/admin/produtos', name: 'Admin Produtos' },
  { path: '/admin/usuarios', name: 'Admin Usuarios' }
];

let allConsoleErrors = [];
let allIssues = [];

async function testPage(page, pageInfo, viewport, viewportName) {
  const consoleErrors = [];

  // Listener para erros de console
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push({
        page: pageInfo.name,
        viewport: viewportName,
        message: msg.text()
      });
    }
  });

  page.on('pageerror', error => {
    consoleErrors.push({
      page: pageInfo.name,
      viewport: viewportName,
      message: error.message
    });
  });

  try {
    await page.setViewportSize(viewport);
    await page.goto(`http://localhost:3000${pageInfo.path}`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);

    // Screenshot
    const filename = `test-results/responsive-${pageInfo.name.toLowerCase().replace(/\s+/g, '-')}-${viewportName.toLowerCase().split(' ')[0]}.png`;
    await page.screenshot({ path: filename, fullPage: true });

    // Verificar overflow horizontal
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    if (hasHorizontalScroll) {
      allIssues.push({
        page: pageInfo.name,
        viewport: viewportName,
        issue: 'Overflow horizontal detectado'
      });
    }

    // Verificar elementos cortados ou fora da tela
    const elementsOutOfView = await page.evaluate(() => {
      const elements = document.querySelectorAll('button, a, input, img');
      let outOfView = 0;
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > window.innerWidth || rect.left < 0) {
          outOfView++;
        }
      });
      return outOfView;
    });

    if (elementsOutOfView > 0) {
      allIssues.push({
        page: pageInfo.name,
        viewport: viewportName,
        issue: `${elementsOutOfView} elementos fora da tela`
      });
    }

    // Verificar se textos estao muito pequenos em mobile
    if (viewportName.includes('Mobile')) {
      const smallTexts = await page.evaluate(() => {
        const texts = document.querySelectorAll('p, span, a, button');
        let tooSmall = 0;
        texts.forEach(el => {
          const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
          if (fontSize < 12 && el.textContent.trim().length > 0) {
            tooSmall++;
          }
        });
        return tooSmall;
      });

      if (smallTexts > 5) {
        allIssues.push({
          page: pageInfo.name,
          viewport: viewportName,
          issue: `${smallTexts} textos muito pequenos (<12px)`
        });
      }
    }

    // Verificar botoes/links muito pequenos para touch
    if (viewportName.includes('Mobile') || viewportName.includes('Tablet')) {
      const smallTouchTargets = await page.evaluate(() => {
        const touchTargets = document.querySelectorAll('button, a, input[type="checkbox"], input[type="radio"]');
        let tooSmall = 0;
        touchTargets.forEach(el => {
          const rect = el.getBoundingClientRect();
          if ((rect.width < 44 || rect.height < 44) && rect.width > 0 && rect.height > 0) {
            // Ignorar links inline em textos
            if (el.tagName === 'A' && el.closest('p')) return;
            tooSmall++;
          }
        });
        return tooSmall;
      });

      if (smallTouchTargets > 10) {
        allIssues.push({
          page: pageInfo.name,
          viewport: viewportName,
          issue: `${smallTouchTargets} alvos de toque pequenos (<44px)`
        });
      }
    }

    allConsoleErrors.push(...consoleErrors);
    return { success: true, errors: consoleErrors.length };

  } catch (error) {
    allIssues.push({
      page: pageInfo.name,
      viewport: viewportName,
      issue: `Erro ao carregar: ${error.message}`
    });
    return { success: false, errors: 0 };
  }
}

async function main() {
  console.log('=== TESTE DE RESPONSIVIDADE COMPLETO ===\n');

  const browser = await chromium.launch({ headless: true });

  // Testar paginas publicas
  console.log('--- PAGINAS PUBLICAS ---\n');

  for (const viewport of Object.values(viewports)) {
    console.log(`\n[${viewport.name}]`);
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();

    for (const pageInfo of pages) {
      const result = await testPage(page, pageInfo, viewport, viewport.name);
      const status = result.success ? '✓' : '✗';
      const errorInfo = result.errors > 0 ? ` (${result.errors} erros)` : '';
      console.log(`  ${status} ${pageInfo.name}${errorInfo}`);
    }

    await context.close();
  }

  // Testar paginas admin (precisa login)
  console.log('\n--- PAGINAS ADMIN ---\n');

  for (const viewport of Object.values(viewports)) {
    console.log(`\n[${viewport.name}]`);
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();

    // Login
    await page.goto('http://localhost:3000/login');
    await page.waitForTimeout(1000);
    await page.fill('input[type="email"]', 'admin@sabordacasa.com.br');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    for (const pageInfo of adminPages) {
      const result = await testPage(page, pageInfo, viewport, viewport.name);
      const status = result.success ? '✓' : '✗';
      const errorInfo = result.errors > 0 ? ` (${result.errors} erros)` : '';
      console.log(`  ${status} ${pageInfo.name}${errorInfo}`);
    }

    await context.close();
  }

  await browser.close();

  // Relatorio
  console.log('\n\n=== RELATORIO ===\n');

  console.log('ERROS DE CONSOLE:');
  if (allConsoleErrors.length === 0) {
    console.log('  Nenhum erro encontrado!\n');
  } else {
    const uniqueErrors = [...new Set(allConsoleErrors.map(e => e.message))];
    uniqueErrors.forEach(err => {
      console.log(`  - ${err.substring(0, 100)}${err.length > 100 ? '...' : ''}`);
    });
    console.log(`\n  Total: ${allConsoleErrors.length} erros em ${uniqueErrors.length} tipos unicos\n`);
  }

  console.log('PROBLEMAS DE RESPONSIVIDADE:');
  if (allIssues.length === 0) {
    console.log('  Nenhum problema encontrado!\n');
  } else {
    allIssues.forEach(issue => {
      console.log(`  - [${issue.viewport}] ${issue.page}: ${issue.issue}`);
    });
    console.log(`\n  Total: ${allIssues.length} problemas\n`);
  }

  // Salvar relatorio em JSON
  const report = {
    timestamp: new Date().toISOString(),
    consoleErrors: allConsoleErrors,
    responsiveIssues: allIssues,
    summary: {
      totalConsoleErrors: allConsoleErrors.length,
      uniqueConsoleErrors: [...new Set(allConsoleErrors.map(e => e.message))].length,
      totalResponsiveIssues: allIssues.length
    }
  };

  require('fs').writeFileSync('test-results/responsividade-report.json', JSON.stringify(report, null, 2));
  console.log('Relatorio salvo em: test-results/responsividade-report.json');
  console.log('Screenshots salvos em: test-results/responsive-*.png\n');
}

main().catch(console.error);
