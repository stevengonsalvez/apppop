import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env.test' });

console.log(process.env.PLAYWRIGHT_BASE_URL, 'PLAYWRIGHT_TEST_BASE_URL');
export default defineConfig({
  testDir: './playwright',
  globalSetup: path.join(__dirname, 'playwright/global-setup.ts'),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    headless: !!process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: {
          cookies: [],
          origins: [
            {
              origin: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
              localStorage: [
                {
                  name: 'CookieConsent',
                  value: JSON.stringify({ necessary: true, analytics: true, marketing: true })
                }
              ]
            }
          ]
        }
      },
    },
  ],
  webServer: process.env.RUN_WEBSERVER === 'true' ? {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  } : undefined,
});