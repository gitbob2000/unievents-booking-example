const request = require('supertest');
const { createApp } = require('../src/app');

test('GET /health returns ok', async () => {
  const res = await request(createApp()).get('/health');
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ status: 'ok' });
});