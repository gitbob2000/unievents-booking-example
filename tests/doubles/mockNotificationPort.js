// Mock: records calls so tests can verify the email was requested.
// No real email is ever sent. Contract: send(to, templateId, data)
class MockNotificationPort {
  constructor() {
    this.send = jest.fn().mockResolvedValue(undefined);
  }
}

module.exports = { MockNotificationPort };
