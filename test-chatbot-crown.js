const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);

  // Screenshot do botão do chatbot
  await page.screenshot({ path: 'test-results/chatbot-crown.png', fullPage: false });

  // Zoom no canto inferior direito onde está o botão
  await page.evaluate(() => {
    const btn = document.querySelector('button[class*="fixed"][class*="bottom-6"]');
    if (btn) btn.scrollIntoView({ block: 'center' });
  });

  await page.waitForTimeout(1000);

  console.log('Screenshot salvo em test-results/chatbot-crown.png');
  console.log('Verifique se a coroa dourada aparece acima do ícone de chat.');

  await browser.close();
})();
