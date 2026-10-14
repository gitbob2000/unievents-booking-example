const { createApp } = require('../src/app');
const { InMemoryBookingRepository } = require('../src/inMemoryBookingRepository');
const { StubEventQuery } = require('../tests/doubles/stubEventQuery');
const { FakeAuth } = require('../tests/doubles/fakeAuth');

const PORT = process.env.E2E_PORT || 3100;

const app = createApp({
  eventQuery: new StubEventQuery(),   // fixtures E1, E2, E3 (Table 7)
  auth: new FakeAuth(),               // trusts x-test-* headers: TEST USE ONLY
  notifier: { send: async () => {} }, // no real email is sent
  bookingRepo: new InMemoryBookingRepository(),
});

app.listen(PORT, () => console.log(`E2E test server on port ${PORT}`));

// Never deploy this file. FakeAuth believes whatever headers it receives, so it is only safe in tests. 
// Real login belongs to slice S3.