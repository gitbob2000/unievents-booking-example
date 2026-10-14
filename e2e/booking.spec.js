const { test, expect } = require('@playwright/test');

test.describe('T-S1-09 student books a place (UI)', () => {
  // "Log in as a student": FakeAuth reads these headers on every request
  test.use({
    extraHTTPHeaders: { 'x-test-user': 'stu1', 'x-test-role': 'STUDENT' },
  });

  test('shows the confirmation and changes the button to Booked', async ({ page }) => {
    await page.goto('/events/E1');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Film Society Screening' })
    ).toBeVisible();

    await page.getByRole('button', { name: 'Book a place' }).click();

    const confirmation = page.locator('#confirmation');
    await expect(confirmation).toBeVisible();
    await expect(confirmation).toContainText('Film Society Screening');
    await expect(confirmation).toContainText('2026-11-20');
    await expect(confirmation).toContainText(/BK-\d{4}/);
    await expect(page.getByRole('button', { name: 'Booked' })).toBeDisabled();
  });
});