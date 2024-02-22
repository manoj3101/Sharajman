// @ts-check
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './src/tests',
  timeout: 120 * 1000,
  // expect: {
  //   timeout: 180 * 1000,
  // },

  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'],
  ['allure-playwright', { outputFolder: 'allure-results' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'off',
    video: 'off',
    headless: false,
    screenshot: 'off',

  },

  /* Configure projects for major browsers */
  projects: [
    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'],
    //   launchOptions: {
    //   args: ['--start-fullscreen'] } },
    // },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox']
      },
    },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'],
    //   launchOptions: {
    //   args: ['--start-fullscreen'] } },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     ...devices['Desktop Chrome'], channel: 'chrome',
    //     launchOptions: {
    //       args: ['--start-fullscreen']
    //     },
    //   }
    // },

    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     ...devices['Desktop Edge'], channel: 'msedge',
    //     launchOptions: {
    //       args: ['--start-fullscreen']
    //     },
    //   },
    // },

    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     launchOptions: {
    //       args: ['--kiosk']
    //     },
    //   },
    // },

  ],

  /*Folder for test artifacts such as screenshots, videos, traces, etc.*/
  //outputDir: './test-results',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },

});

