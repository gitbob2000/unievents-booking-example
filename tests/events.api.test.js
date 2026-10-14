const request = require('supertest');
const { createApp } = require('../src/app');
const { StubEventQuery } = require('./doubles/stubEventQuery');

describe('event details and booking page', () => {
  const app = createApp({ eventQuery: new StubEventQuery() });

  test('GET /api/events/E1 returns the event details', async () => {
    const res = await request(app).get('/api/events/E1');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: 'E1',
      title: 'Film Society Screening',
      date: '2026-11-20',
    });
  });

  test('GET /api/events/E99 returns 404 EVENT_NOT_FOUND', async () => {
    const res = await request(app).get('/api/events/E99');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('EVENT_NOT_FOUND'); // Express's default 404 has no JSON body
  });

  test('GET /events/E1 serves the booking page', async () => {
    const res = await request(app).get('/events/E1');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text).toContain('Book a place');
  });
});