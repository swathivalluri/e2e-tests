import 'tsconfig-paths/register'
import { defineConfig} from '@playwright/test';
import dotenv from 'dotenv'

//load env variables from .env file
dotenv.config()

export default defineConfig({
  // Global setup and Teardown
  globalSetup: require.resolve('./config/globalSetup.ts'),
  globalTeardown: require.resolve('./config/globalTeardown.ts'),

  testDir: './src/tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  // retries: process.env.CI ? 2 : 0,
  timeout: 60 * 1000,
  expect: { timeout: 10000},
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never' }] // Enable tracing in Html reports
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'https://www.globalsqa.com',
    headless: process.env.HEADLESS === 'false' ? false : true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },

    {
      name: 'firefox',
      use: { browserName: 'firefox' }
    },

    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    }
  ]

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
