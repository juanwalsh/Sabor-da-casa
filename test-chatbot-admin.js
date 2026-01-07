const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Testar chatbot na área admin
  await page.goto('http://localhost:3000/admin');
  await page.waitForTimeout(2000);

  // Clicar no botão do chatbot
  const chatButton = await page.locator('button.fixed.bottom-6.right-6').first();
  await chatButton.click();
  await page.waitForTimeout(1000);

  // Screenshot do chatbot admin
  await page.screenshot({ path: 'test-results/chatbot-admin.png' });

  console.log('Screenshot salvo em test-results/chatbot-admin.png');

  await browser.close();
})();
