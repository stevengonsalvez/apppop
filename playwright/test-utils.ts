import { Page } from '@playwright/test';

export async function acceptCookieConsent(page: Page) {
  try {
    await page.waitForSelector('.CookieConsent', { timeout: 5000 });
    
    const acceptButton = await page.getByRole('button', { name: 'Accept cookies' });
    if (await acceptButton.count() > 0) {
      await acceptButton.click();
      
      await page.waitForFunction(() => {
        return Object.keys(localStorage).some(key => key.startsWith('cookie_consent_'));
      }, { timeout: 5000 });
    }
  } catch (e) {
    console.log('Cookie consent handling failed:', e);
  }
}

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button:has-text("Sign in")');
  await page.waitForURL('/home');
}

export async function registerUser(page: Page, email: string, password: string, fullName: string) {
  await page.goto('/register');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button:has-text("Continue")');

  await page.fill('input[placeholder="Full name"]', fullName);
  await page.fill('input[type="date"]', '1990-01-01');
  await page.click('button:has-text("Continue")');
  await page.click('button:has-text("Complete Registration")');
}

export async function waitForToast(page: Page, text: string | RegExp) {
  await page.waitForSelector('ion-toast', { state: 'attached' });
  await page.getByText(text).waitFor();
}