const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    charts: true,
    reportPageTitle: 'Cypress API Automation Report',
    inlineAssets: true,
  },
  env: {
    // Public demo credentials published by Restful-Booker. Override with CYPRESS_ADMIN_USER / CYPRESS_ADMIN_PASSWORD.
    ADMIN_USER: 'admin',
    ADMIN_PASSWORD: 'password123',
  },
  e2e: {
    baseUrl: 'https://restful-booker.herokuapp.com',
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
