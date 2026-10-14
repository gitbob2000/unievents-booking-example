const request = require('supertest');
const { createApp } = require('../src/app');

describe('SNFR-02 security headers', () => {
  const app = createApp({});

  test('T-S1-12 sends security headers and hides the framework name', async () => {
    const res = await request(app).get('/health');

    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['content-security-policy']).toContain("default-src 'self'");
    expect(res.headers['x-frame-options']).toBeDefined();
    expect(res.headers['x-powered-by']).toBeUndefined();
  });
});