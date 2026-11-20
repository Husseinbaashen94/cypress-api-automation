const { existsSync } = require('node:fs');
const { defineConfig } = require('cypress');

// Optional local settings: copy .env.example to .env. Empty values fall back to the defaults below.
if (existsSync('.env')) process.loadEnvFile('.env');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    charts: true,
    reportPageTitle: 'Cypress API Automation Report',
    inlineAssets: true,
  },
  env: {
    // Defaults are the public demo credentials published by Restful-Booker.
    ADMIN_USER: process.env.ADMIN_USER || 'admin',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'password123',
  },
  e2e: {
    baseUrl: process.env.BASE_URL || 'https://restful-booker.herokuapp.com',
    supportFile: 'cypress/support/e2e.js',
    video: false,
    screenshotOnRunFailure: false,
    requestTimeout: 15000,
    responseTimeout: 30000,
    retries: { runMode: 1, openMode: 0 },
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
  },
});
