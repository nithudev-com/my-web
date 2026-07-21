const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 375, height: 812 }
  });
  await page.goto('https://sextoyslovers.com/');
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  await browser.close();
})();
