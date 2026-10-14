// Stub: returns fixed events. Contract: getEvent(id) -> event or null
const EVENTS = {
  E1: { id: 'E1', title: 'Film Society Screening', date: '2026-11-20', status: 'published', capacity: 80, booked: 10 }, // open
  E2: { id: 'E2', title: 'Quiz Night', date: '2026-11-22', status: 'published', capacity: 80, booked: 80 },            // full
  E3: { id: 'E3', title: 'Careers Fair', date: '2026-11-25', status: 'published', capacity: 80, booked: 79 },          // last place
};

class StubEventQuery {
  async getEvent(id) {
    return EVENTS[id] ? { ...EVENTS[id] } : null;
  }
}

module.exports = { StubEventQuery };