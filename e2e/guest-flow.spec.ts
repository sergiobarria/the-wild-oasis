import { expect, test } from '@playwright/test';

/**
 * Guest journey (WO-071): sign-up -> browse cabins -> demo booking -> guest dashboard shows it.
 * Uses the demo (non-Stripe) confirmation path deliberately -- deterministic, no external
 * payment provider dependency. Runs unauthenticated (see playwright.config.ts's `chromium`
 * project) since sign-up itself must start from a signed-out context.
 */
test('sign-up, browse, demo-book a cabin, and see it on the dashboard', async ({ page }) => {
    const email = `guest-${Date.now()}@example.com`;

    await page.goto('/sign-up');
    await page.getByLabel('First name').fill('E2E');
    await page.getByLabel('Last name').fill('Guest');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password', { exact: true }).fill('TestPass123!');
    await page.getByLabel('Confirm password').fill('TestPass123!');
    await page.getByRole('checkbox').click();
    await page.getByRole('button', { name: 'Create account' }).click();

    await page.waitForURL('/guest-area');

    await page.goto('/cabins');
    await page.getByRole('link', { name: 'View Cabin' }).first().click();
    await page.waitForURL(/\/cabins\//);

    // Randomized within a wide future window -- a fixed offset collides with whatever this
    // same spec booked on a previous run today (this dev deployment persists across runs).
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 60 + Math.floor(Math.random() * 300));
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 3);
    const isoCheckIn = checkIn.toISOString().slice(0, 10);
    const isoCheckOut = checkOut.toISOString().slice(0, 10);

    await page.getByLabel('Check-in').fill(isoCheckIn);
    await page.getByLabel('Check-out').fill(isoCheckOut);
    await page.getByRole('button', { name: 'Reserve' }).click();

    await page.waitForURL(/\/checkout\/summary/);
    await expect(page.getByRole('button', { name: 'Confirm Reservation' })).toBeVisible();
    await page.getByRole('button', { name: 'Confirm Reservation' }).click();

    await page.waitForURL(/\/checkout\/success/);
    await expect(page.getByRole('heading', { name: 'Reservation confirmed' })).toBeVisible();

    await page.getByRole('button', { name: 'Go to dashboard' }).click();
    await page.waitForURL('/guest-area');

    await page.goto('/guest-area/bookings');
    await expect(page.getByText(isoCheckIn)).toBeVisible();
});
