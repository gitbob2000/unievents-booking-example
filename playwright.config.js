const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }]]
    : 'list',
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'retain-on-failure',
  },
  // Playwright starts the test server for us and waits until /health responds
  webServer: {
    command: 'node e2e/testServer.js',
    url: 'http://localhost:3100/health',
    reuseExistingServer: !process.env.CI,
  },
});