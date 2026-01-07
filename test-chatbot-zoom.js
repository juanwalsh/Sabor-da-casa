const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ viewport: { width: 400, height: 400 } });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);

  // Localizar o botão do chatbot e fazer screenshot dele
  const chatButton = await page.locator('button.fixed.bottom-6.right-6').first();

  if (await chatButton.isVisible()) {
    await chatButton.screenshot({ path: 'test-results/chatbot-button-zoom.png' });
    console.log('Screenshot do botão salvo em test-results/chatbot-button-zoom.png');
  } else {
    console.log('Botão do chatbot não encontrado, tirando screenshot geral...');
    await page.screenshot({ path: 'test-results/chatbot-button-zoom.png' });
  }

  await browser.close();
})();
