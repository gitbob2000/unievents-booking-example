const { InMemoryBookingRepository } = require('../src/inMemoryBookingRepository');

// Helper: builds a booking object for tests
const booking = (reference, eventId = 'E1', studentId = 'stu1') => ({
  reference,
  eventId,
  studentId,
});

describe('InMemoryBookingRepository', () => {
  let repo;

  // A fresh, empty repository for every test, so tests cannot affect each other
  beforeEach(() => {
    repo = new InMemoryBookingRepository();
  });

  describe('constructor', () => {
    test('starts with no bookings', () => {
      expect(repo.all()).toEqual([]);
    });
  });

  describe('save', () => {
    test('stores the booking and returns it', async () => {
      const b = booking('BK-0001');

      const saved = await repo.save(b);

      expect(saved).toEqual(b);
      expect(repo.all()).toEqual([b]);
    });

    test('keeps every saved booking', async () => {
      await repo.save(booking('BK-0001', 'E1', 'stu1'));
      await repo.save(booking('BK-0002', 'E1', 'stu2'));
      await repo.save(booking('BK-0003', 'E2', 'stu1'));

      expect(repo.all()).toHaveLength(3);
    });
  });

  describe('findBookingsByStudentId', () => {
    test('returns only the bookings that belong to that student', async () => {
      const b1 = booking('BK-0001', 'E1', 'stu1');
      const b2 = booking('BK-0002', 'E1', 'stu2');
      const b3 = booking('BK-0003', 'E2', 'stu1');
      await repo.save(b1);
      await repo.save(b2);
      await repo.save(b3);

      const result = await repo.findBookingsByStudentId('stu1');

      expect(result).toEqual([b1, b3]); // right ones, in the order saved
    });

    test('returns an empty array when the student has no bookings', async () => {
      await repo.save(booking('BK-0001', 'E1', 'stu2'));

      const result = await repo.findBookingsByStudentId('stu1');

      expect(result).toEqual([]);
    });

    test('returns an empty array when the repository is empty', async () => {
      const result = await repo.findBookingsByStudentId('stu1');

      expect(result).toEqual([]);
    });

    test('does not change the stored bookings when the result is modified', async () => {
      await repo.save(booking('BK-0001', 'E1', 'stu1'));

      const result = await repo.findBookingsByStudentId('stu1');
      result.push(booking('BK-9999', 'E9', 'stu1'));

      expect(repo.all()).toHaveLength(1);
    });
  });

  describe('all', () => {
    test('returns an empty array when nothing has been saved', () => {
      expect(repo.all()).toEqual([]);
    });

    test('returns bookings in the order they were saved', async () => {
      await repo.save(booking('BK-0001'));
      await repo.save(booking('BK-0002', 'E2'));

      expect(repo.all().map((b) => b.reference)).toEqual(['BK-0001', 'BK-0002']);
    });

    test('returns a copy, so changing the result does not change the store', async () => {
      await repo.save(booking('BK-0001'));

      const list = repo.all();
      list.push(booking('BK-9999'));

      expect(repo.all()).toHaveLength(1);
    });
  });
});