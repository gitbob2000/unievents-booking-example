const { book } = require('../src/bookingPolicy');

// Test data: event E1 has a capacity of 80 places
const eventWithBooked = (booked) => ({ id: 'E1', capacity: 80, booked });

describe('BookingPolicy.book', () => {
  test('T-S1-01 books a place when the event has space', () => {
    const result = book({
      event: eventWithBooked(79),
      studentId: 'stu1',
      existingBookings: [],
    });

    expect(result.ok).toBe(true);
    expect(result.booked).toBe(80);
    expect(result.booking.reference).toMatch(/^BK-\d{4}$/);
    expect(result.booking).toMatchObject({ eventId: 'E1', studentId: 'stu1' });
  });

  test('T-S1-03 rejects a duplicate booking by the same student', () => {
    const existingBookings = [
      { reference: 'BK-0001', eventId: 'E1', studentId: 'stu1' },
    ];

    const result = book({
      event: eventWithBooked(10),
      studentId: 'stu1',
      existingBookings,
    });

    expect(result.ok).toBe(false);
    expect(result.error).toBe('ALREADY_BOOKED');
    expect(result.booked).toBe(10); // unchanged
    expect(result.booking).toBeUndefined(); // no new booking created
  });

  test('T-S1-05 rejects a booking when the event is full (boundary)', () => {
    const result = book({
      event: eventWithBooked(80),
      studentId: 'stu1',
      existingBookings: [],
    });

    expect(result.ok).toBe(false);
    expect(result.error).toBe('EVENT_FULL');
    expect(result.booked).toBe(80); // unchanged
    expect(result.booking).toBeUndefined();
  });
});