// Fake: reads the "logged-in user" from test headers instead of real login.
// Contract: authenticate(req) -> { userId, role, email } or null
class FakeAuth {
  authenticate(req) {
    const userId = req.header('x-test-user');
    const role = req.header('x-test-role');
    if (!userId || !role) return null;
    return { userId, role, email: `${userId}@student.example.ac.uk` };
  }
}

module.exports = { FakeAuth };