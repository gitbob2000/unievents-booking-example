class InMemoryBookingRepository {
  constructor() {
    this.bookings = [];
  }

  async save(booking) {
    this.bookings.push(booking);
    return booking;
  }

  async findBookingsByStudentId(studentId) {
    return this.bookings.filter((b) => b.studentId === studentId);
  }

    all() {
    return [...this.bookings];
  }

}

module.exports = { InMemoryBookingRepository };
