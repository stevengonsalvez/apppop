import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto(baseURL!);
  
  try {
    await page.waitForSelector('.CookieConsent', { timeout: 5000 });
    
    const acceptButton = await page.locator([
      'button:has-text("Accept")',
      '.CookieConsent button:first-of-type',
      'button[style*="background: rgb(16, 185, 129)"]'
    ].join(', ')).first();
    
    if (await acceptButton.count() > 0) {
      await acceptButton.click();
      
      let attempts = 0;
      while (attempts < 50) {
        const consent = await page.evaluate(() => {
          const consents = Object.keys(localStorage).filter(key => key.startsWith('cookie_consent_'));
          return consents.length > 0;
        });
        
        if (consent) break;
        
        await page.waitForTimeout(100);
        attempts++;
      }
    }
  } catch (e) {
    console.log('Cookie banner interaction failed:', e);
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;