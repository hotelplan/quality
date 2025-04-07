import { defineConfig, devices } from '@playwright/test';
import baseEnvUrl from './tests/resources/utils/environmentBaseUrl';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["line"],
    ["allure-playwright"],
    ["html", { outputFolder: "test-results" }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    headless: true,
    trace: 'on-first-retry',
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.ENV === 'prod'
      ? baseEnvUrl.prod.inghams
      : process.env.ENV === 'stg'
        ? baseEnvUrl.stg.inghams
        : baseEnvUrl.qa.inghams
  },
  timeout: 60000,
  expect: {

    timeout: 60000
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'get storage state',
      testMatch: /.*\.setup\.ts/,
      fullyParallel: true
    },
    {
      name: 'Chromium',
      dependencies: ['get storage state'],
      use: {
        ...devices['Desktop Chrome'],
        screenshot: 'on',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
        //viewport: { width: 1920, height: 1080 }
      },

    },

    {
      name: 'Safari',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile_Chrome',
      use: {
        ...devices['Pixel 5'],
        screenshot: 'on',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
      },
    },
    {
      name: 'Mobile_Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* Test against specific tags. */
    {
      name: 'Smoke',
      grep: /@smoke/,
    },
    {
      name: 'Regression',
      grep: /@regression/,
    },
    {
      name: 'UAT',
      grep: /@uat/,
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
