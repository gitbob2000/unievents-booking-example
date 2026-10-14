const request = require('supertest');
const { createApp } = require('../src/app');
const { InMemoryBookingRepository } = require('../src/inMemoryBookingRepository');
const { StubEventQuery } = require('./doubles/stubEventQuery');
const { FakeAuth } = require('./doubles/fakeAuth');
const { MockNotificationPort } = require('./doubles/mockNotificationPort');

function setup() {
  const bookingRepo = new InMemoryBookingRepository();
  const notifier = new MockNotificationPort();
  const app = createApp({
    eventQuery: new StubEventQuery(),
    auth: new FakeAuth(),
    notifier,
    bookingRepo,
  });
  return { app, bookingRepo, notifier };
}

const asStudent = (req, id = 'stu1') =>
  req.set('x-test-user', id).set('x-test-role', 'STUDENT');

describe('POST /bookings', () => {
  test('T-S1-02 books a place and requests one confirmation email', async () => {
    const { app, bookingRepo, notifier } = setup();

    const res = await asStudent(request(app).post('/bookings')).send({ eventId: 'E1' });

    expect(res.status).toBe(201);
    expect(res.body.bookingRef).toMatch(/^BK-\d{4}$/);
    expect(res.body.eventTitle).toBe('Film Society Screening');
    expect(res.body.eventDate).toBe('2026-11-20');
    expect(bookingRepo.all()).toHaveLength(1);
    expect(notifier.send).toHaveBeenCalledTimes(1);
    expect(notifier.send).toHaveBeenCalledWith(
      'stu1@student.example.ac.uk',
      'BOOKING_CONFIRMATION',
      { eventTitle: 'Film Society Screening', bookingRef: res.body.bookingRef }
    );
  });

  test('T-S1-04 rejects a second booking by the same student', async () => {
    const { app, bookingRepo, notifier } = setup();

    const first = await asStudent(request(app).post('/bookings')).send({ eventId: 'E1' });
    const second = await asStudent(request(app).post('/bookings')).send({ eventId: 'E1' });

    expect(first.status).toBe(201);
    expect(second.status).toBe(409);
    expect(second.body.message).toBe('You are already booked on this event');
    expect(bookingRepo.all()).toHaveLength(1);
    expect(notifier.send).toHaveBeenCalledTimes(1); // no second email
  });

  test('T-S1-06 rejects a booking when the event is full', async () => {
    const { app, bookingRepo, notifier } = setup();

    const res = await asStudent(request(app).post('/bookings')).send({ eventId: 'E2' });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe('This event is full');
    expect(bookingRepo.all()).toHaveLength(0);
    expect(notifier.send).not.toHaveBeenCalled();
  });

  test('T-S1-07 returns 401 when not logged in', async () => {
    const { app, bookingRepo } = setup();

    const res = await request(app).post('/bookings').send({ eventId: 'E1' });

    expect(res.status).toBe(401);
    expect(bookingRepo.all()).toHaveLength(0);
  });

  test('T-S1-08 returns 403 for a non-student role', async () => {
    const { app, bookingRepo } = setup();

    const res = await request(app)
      .post('/bookings')
      .set('x-test-user', 'org1')
      .set('x-test-role', 'ORGANISER')
      .send({ eventId: 'E1' });

    expect(res.status).toBe(403);
    expect(bookingRepo.all()).toHaveLength(0);
  });

//   test('extra: returns 404 when the event does not exist', async () => {
//     const { app, bookingRepo } = setup();

//     const res = await asStudent(request(app).post('/bookings')).send({ eventId: 'E99' });

//     expect(res.status).toBe(404);
//     expect(bookingRepo.all()).toHaveLength(0);
//   });
  test('extra: returns 404 EVENT_NOT_FOUND when the event does not exist', async () => {
    const { app, bookingRepo } = setup();

    const res = await asStudent(request(app).post('/bookings')).send({ eventId: 'E99' });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('EVENT_NOT_FOUND'); // Express's default 404 has no JSON body
    expect(bookingRepo.all()).toHaveLength(0);
  });
});