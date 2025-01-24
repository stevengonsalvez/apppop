import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
  const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'password123';

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login form', async ({ page }) => {
    await page.goto('/login');
    
    // Verify form elements
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/login');
    
    // Submit empty form
    const loginButton = page.getByRole('button', { name: /sign in/i });
    await loginButton.click();
    
    // Verify error message
    await expect(
      page.getByText('Please fill in all required fields', { exact: false })
    ).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill with invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit form
    const loginButton = page.getByRole('button', { name: /sign in/i });
    await loginButton.click();

    // Verify error message
    await expect(
      page.getByText(/invalid login credentials/i)
    ).toBeVisible();
  });

  test('should successfully log in with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill with valid credentials
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    
    // Submit form
    const loginButton = page.getByRole('button', { name: /sign in/i });
    await loginButton.click();

    // Verify successful login
    await expect(page).toHaveURL('/home');
  });

  test('should allow registration', async ({ page }) => {
    await page.goto('/register');
    
    // Fill registration form
    await page.fill('input[type="email"]', `test_${Date.now()}@example.com`);
    await page.fill('input[type="password"]', 'Test123!@#');
    await page.fill('input[placeholder="Full name"]', 'Test User');
    
    // Go through registration steps
    await page.click('button:has-text("Continue")');
    await expect(page.getByText('Personal Details')).toBeVisible();
    
    // Fill personal details
    await page.fill('input[type="text"]', 'Test User');
    await page.fill('input[type="date"]', '1990-01-01');
    await page.click('button:has-text("Continue")');
    
    // Complete registration
    await page.click('button:has-text("Complete Registration")');
    
    // Verify success message
    await expect(
      page.getByText(/registration successful/i)
    ).toBeVisible();
  });
});