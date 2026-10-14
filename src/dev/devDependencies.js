// DEMO WIRING FOR LOCAL DEVELOPMENT ONLY.
// Stands in for slice S2 (events) and S3 (login) until they exist.
const { InMemoryBookingRepository } = require('../inMemoryBookingRepository');

const EVENTS = {
  E1: { id: 'E1', title: 'Film Society Screening', date: '2026-11-20', status: 'published', capacity: 80, booked: 10 },
  E2: { id: 'E2', title: 'Quiz Night', date: '2026-11-22', status: 'published', capacity: 80, booked: 80 },
  E3: { id: 'E3', title: 'Careers Fair', date: '2026-11-25', status: 'published', capacity: 80, booked: 79 },
};

function createDevDependencies() {
  return {
    eventQuery: {
      async getEvent(id) {
        return EVENTS[id] ? { ...EVENTS[id] } : null;
      },
    },
    // A browser cannot send the x-test-* headers, so everyone is "student stu1"
    auth: {
      authenticate() {
        return { userId: 'stu1', role: 'STUDENT', email: 'stu1@student.example.ac.uk' };
      },
    },
    notifier: {
      async send(to, templateId, data) {
        console.log('[dev email]', to, templateId, data);
      },
    },
    bookingRepo: new InMemoryBookingRepository(),
  };
}

module.exports = { createDevDependencies };