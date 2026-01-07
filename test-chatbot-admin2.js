const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Ir para login e fazer login
  await page.goto('http://localhost:3000/admin');
  await page.waitForTimeout(1500);

  // Fazer login
  await page.fill('input[type="email"]', 'admin@sabordacasa.com.br');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button:has-text("Acessar Painel")');
  await page.waitForTimeout(2000);

  // Agora estamos no dashboard admin
  await page.screenshot({ path: 'test-results/chatbot-admin-dashboard.png' });

  // Clicar no chatbot
  const chatButton = await page.locator('button.fixed.bottom-6.right-6').first();
  if (await chatButton.isVisible()) {
    await chatButton.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/chatbot-admin-open.png' });
  }

  console.log('Screenshots salvos em test-results/');

  await browser.close();
})();
