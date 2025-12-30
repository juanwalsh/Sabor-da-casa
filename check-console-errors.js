const { chromium } = require('playwright');

async function checkConsoleErrors() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  const warnings = [];

  page.on('console', msg => {
    const text = msg.text();
    // Ignorar mensagens do React DevTools e SW
    if (text.includes('Download the React DevTools') || text.includes('SW registrado')) return;

    if (msg.type() === 'error') {
      errors.push({ page: page.url(), error: text });
    } else if (msg.type() === 'warning') {
      warnings.push({ page: page.url(), warning: text });
    }
  });

  page.on('pageerror', err => {
    errors.push({ page: page.url(), error: `Page Error: ${err.message}` });
  });

  // Test Home
  console.log('\n=== Testing Home ===');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1500);

  // Click on a product card to open modal
  try {
    const productCard = page.locator('.group.cursor-pointer').first();
    if (await productCard.isVisible()) {
      await productCard.click();
      await page.waitForTimeout(1000);
      // Close modal
      const closeBtn = page.locator('[data-state="open"] button').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await page.waitForTimeout(500);
      }
    }
  } catch (e) {
    console.log('Could not test modal on home');
  }

  // Test Cardápio
  console.log('\n=== Testing Cardápio ===');
  await page.goto('http://localhost:3000/cardapio', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1500);

  // Test voice search button
  try {
    const voiceBtn = page.locator('button:has-text("voice")').first();
    if (await voiceBtn.isVisible()) {
      console.log('Voice search button found');
    }
  } catch (e) {}

  // Add item to cart
  try {
    const addBtn = page.locator('button:has-text("Adicionar")').first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(1000);
    }
  } catch (e) {
    console.log('Could not add item to cart');
  }

  // Open cart sidebar
  try {
    const cartBtn = page.locator('button.relative.rounded-full').first();
    if (await cartBtn.isVisible()) {
      await cartBtn.click();
      await page.waitForTimeout(1000);
    }
  } catch (e) {
    console.log('Could not open cart');
  }

  // Test Checkout
  console.log('\n=== Testing Checkout ===');
  await page.goto('http://localhost:3000/checkout', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1500);

  // Test coupon input
  try {
    const couponInput = page.locator('input[placeholder*="cupom"]').first();
    if (await couponInput.isVisible()) {
      await couponInput.fill('BEMVINDO10');
      const applyBtn = page.locator('button:has-text("Aplicar")').first();
      if (await applyBtn.isVisible()) {
        await applyBtn.click();
        await page.waitForTimeout(500);
      }
    }
  } catch (e) {
    console.log('Could not test coupon');
  }

  // Test theme toggle
  console.log('\n=== Testing Theme Toggle ===');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
  try {
    const themeBtn = page.locator('button:has(svg.lucide-sun), button:has(svg.lucide-moon)').first();
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(1000);
      await themeBtn.click();
      await page.waitForTimeout(500);
    }
  } catch (e) {
    console.log('Could not test theme toggle');
  }

  console.log('\n========================================');
  console.log('            RESULTS');
  console.log('========================================');

  console.log('\n--- ERRORS ---');
  if (errors.length === 0) {
    console.log('✓ No errors found!');
  } else {
    errors.forEach((err, i) => console.log(`${i + 1}. [${err.page}] ${err.error}`));
  }

  console.log('\n--- WARNINGS ---');
  if (warnings.length === 0) {
    console.log('✓ No warnings found!');
  } else {
    warnings.forEach((warn, i) => console.log(`${i + 1}. [${warn.page}] ${warn.warning}`));
  }

  console.log('\n--- SUMMARY ---');
  console.log(`Total Errors: ${errors.length}`);
  console.log(`Total Warnings: ${warnings.length}`);

  await browser.close();
}

checkConsoleErrors().catch(console.error);
