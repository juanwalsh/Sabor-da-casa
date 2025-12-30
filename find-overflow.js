const { chromium } = require('playwright');

async function findOverflow() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();

  console.log('=== ENCONTRANDO ELEMENTOS COM OVERFLOW ===\n');

  // Testar Login
  console.log('1. LOGIN PAGE:');
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(2000);

  const loginOverflow = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const elements = document.querySelectorAll('*');
    const overflowElements = [];

    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 5) {
        overflowElements.push({
          tag: el.tagName,
          class: el.className?.substring?.(0, 80) || '',
          width: rect.width,
          right: rect.right,
          overflow: rect.right - docWidth
        });
      }
    });

    return {
      docWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflowElements: overflowElements.slice(0, 10)
    };
  });

  console.log(`   Document width: ${loginOverflow.docWidth}px`);
  console.log(`   Scroll width: ${loginOverflow.scrollWidth}px`);
  console.log(`   Overflow: ${loginOverflow.scrollWidth - loginOverflow.docWidth}px`);

  if (loginOverflow.overflowElements.length > 0) {
    console.log('   Elementos com overflow:');
    loginOverflow.overflowElements.forEach(el => {
      console.log(`     - <${el.tag}> class="${el.class}" (overflow: ${el.overflow.toFixed(0)}px)`);
    });
  }

  // Testar Admin Usuarios
  console.log('\n2. ADMIN USUARIOS PAGE:');

  // Login primeiro
  await page.fill('input[type="email"]', 'admin@sabordacasa.com.br');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  await page.goto('http://localhost:3000/admin/usuarios');
  await page.waitForTimeout(2000);

  const adminOverflow = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const elements = document.querySelectorAll('*');
    const overflowElements = [];

    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 5) {
        overflowElements.push({
          tag: el.tagName,
          class: el.className?.substring?.(0, 80) || '',
          width: rect.width,
          right: rect.right,
          overflow: rect.right - docWidth
        });
      }
    });

    return {
      docWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflowElements: overflowElements.slice(0, 10)
    };
  });

  console.log(`   Document width: ${adminOverflow.docWidth}px`);
  console.log(`   Scroll width: ${adminOverflow.scrollWidth}px`);
  console.log(`   Overflow: ${adminOverflow.scrollWidth - adminOverflow.docWidth}px`);

  if (adminOverflow.overflowElements.length > 0) {
    console.log('   Elementos com overflow:');
    adminOverflow.overflowElements.forEach(el => {
      console.log(`     - <${el.tag}> class="${el.class}" (overflow: ${el.overflow.toFixed(0)}px)`);
    });
  }

  // Verificar Home tambem para o elemento comum
  console.log('\n3. HOME PAGE:');
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);

  const homeOverflow = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const elements = document.querySelectorAll('*');
    const overflowElements = [];

    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 5 || rect.left < -5) {
        overflowElements.push({
          tag: el.tagName,
          class: el.className?.substring?.(0, 80) || '',
          left: rect.left,
          right: rect.right,
          overflow: rect.right > docWidth ? rect.right - docWidth : Math.abs(rect.left)
        });
      }
    });

    return {
      docWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflowElements: overflowElements.slice(0, 10)
    };
  });

  console.log(`   Document width: ${homeOverflow.docWidth}px`);
  console.log(`   Scroll width: ${homeOverflow.scrollWidth}px`);

  if (homeOverflow.overflowElements.length > 0) {
    console.log('   Elementos fora da tela:');
    homeOverflow.overflowElements.forEach(el => {
      console.log(`     - <${el.tag}> class="${el.class}" (left: ${el.left?.toFixed(0)}, overflow: ${el.overflow.toFixed(0)}px)`);
    });
  }

  console.log('\n=== FIM ===\n');

  await page.waitForTimeout(3000);
  await browser.close();
}

findOverflow().catch(console.error);
