const { test, expect } = require('@playwright/test');
const { AxeBuilder } = require('@axe-core/playwright');

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const asStudent = (id) => ({
  extraHTTPHeaders: { 'x-test-user': id, 'x-test-role': 'STUDENT' },
});

test.describe('T-S1-10a SNFR-01: booking page', () => {
  test.use(asStudent('stu-axe-1'));

  test('has no WCAG 2.2 AA violations', async ({ page }) => {
    await page.goto('/events/E1');
    await expect(page.getByRole('button', { name: 'Book a place' })).toBeEnabled();

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    expect(results.violations).toEqual([]);
  });
});

test.describe('T-S1-10b SNFR-01: confirmation state', () => {
  test.use(asStudent('stu-axe-2'));

  test('has no WCAG 2.2 AA violations after booking', async ({ page }) => {
    await page.goto('/events/E1');
    await page.getByRole('button', { name: 'Book a place' }).click();
    await expect(page.locator('#confirmation')).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    expect(results.violations).toEqual([]);
  });
});

test.describe('T-S1-11 SNFR-01: keyboard only', () => {
  test.use(asStudent('stu-kbd'));

  test('a student can book using only the keyboard', async ({ page }) => {
    await page.goto('/events/E1');
    const button = page.getByRole('button', { name: 'Book a place' });
    await expect(button).toBeEnabled();

    await page.keyboard.press('Tab');
    await expect(button).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page.locator('#confirmation')).toBeVisible();
  });
});