import { expect, request as playwrightRequest, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Admin journey (WO-071): admin login (via the `chromium-admin` project's storageState) ->
 * cabin CRUD (create, verify it appears) -> a booking is visible in the admin bookings table.
 * The booking is seeded independently (a direct Convex API call, not by depending on
 * guest-flow.spec.ts's own booking) so the two spec files stay order-independent under
 * Playwright's parallel workers.
 */

function readEnvLocal(key: string): string {
    const contents = readFileSync(path.join(import.meta.dirname, '..', '.env.local'), 'utf-8');
    const match = contents.match(new RegExp(`^${key}=(.+)$`, 'm'));
    if (!match) throw new Error(`${key} not found in .env.local`);
    return match[1]!.trim();
}

const CONVEX_SITE_URL = readEnvLocal('NEXT_PUBLIC_CONVEX_SITE_URL');
const CONVEX_URL = readEnvLocal('NEXT_PUBLIC_CONVEX_URL');

test('admin can access the dashboard without being redirected', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL('/admin');
    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
});

test('admin creates a cabin and it appears in the cabins list', async ({ page }) => {
    const uniqueSuffix = Date.now();
    const name = `E2E Test Cabin ${uniqueSuffix}`;
    const slug = `e2e-test-cabin-${uniqueSuffix}`;

    await page.goto('/admin/cabins/new');
    await page.getByLabel('Name').fill(name);
    await page.getByLabel('Slug').fill(slug);
    await page.getByLabel('Short description').fill('Created by an e2e test.');
    await page
        .getByLabel('Description', { exact: true })
        .fill('A longer description created by an e2e test.');
    await page.getByLabel('Location').fill('Test Location');

    await page.getByRole('tab', { name: 'Pricing' }).click();
    await page.getByLabel('Nightly rate (USD)').fill('150');
    await page.getByLabel('Cleaning fee (USD)').fill('25');
    await page.getByLabel('Max guests').fill('4');
    await page.getByLabel('Bedrooms').fill('2');
    await page.getByLabel('Beds').fill('2');
    await page.getByLabel('Bathrooms').fill('1');

    await page.getByRole('tab', { name: 'Images' }).click();
    await page
        .locator('#cover-image')
        .setInputFiles(
            path.join(import.meta.dirname, '..', 'public', 'favicon', 'favicon-32x32.png'),
        );
    await expect(page.getByText('Cover image ready.')).toBeVisible();

    await page.getByRole('button', { name: 'Create cabin' }).click();
    await page.waitForURL(/\/admin\/cabins\//);

    await page.goto('/admin/cabins');
    await expect(page.getByText(name)).toBeVisible();
});

test('a booking is visible in the admin bookings table', async ({ page }) => {
    // Seed independently -- a real demo reservation for the fixture guest, via the same
    // Convex API the app itself calls, not the browser (deterministic, no UI flakiness for a
    // step that isn't what this test is actually proving). A fresh, isolated request context
    // -- NOT the test's own `request` fixture -- since `chromium-admin`'s project config
    // already seeds that fixture with the admin's storageState; reusing it here would race
    // the admin's pre-existing session cookie against the guest sign-in's new one.
    // `newContext()` with no options still inherits the running project's `use.storageState`
    // (chromium-admin's admin.json) -- an explicit empty state is required to actually start
    // clean, or the admin's session cookie shadows the guest sign-in below.
    const guestRequest = await playwrightRequest.newContext({
        storageState: { cookies: [], origins: [] },
    });
    const signInResponse = await guestRequest.post(`${CONVEX_SITE_URL}/api/auth/sign-in/email`, {
        headers: { Origin: 'http://localhost:3000' },
        data: { email: 'e2e-fixture-guest@example.com', password: 'TestPass123!' },
    });
    expect(signInResponse.ok()).toBe(true);
    // The response body's `token` is Better Auth's own session token, not the Convex JWT
    // Convex's HTTP API needs -- that lands as a `better-auth.convex_jwt` cookie instead,
    // captured by this request context's cookie jar.
    const { cookies } = await guestRequest.storageState();
    const jwtCookie = cookies.find((cookie) => cookie.name === 'better-auth.convex_jwt');
    if (!jwtCookie) throw new Error('Sign-in did not set a better-auth.convex_jwt cookie.');
    const token = jwtCookie.value;

    const cabinsResponse = await guestRequest.post(`${CONVEX_URL}/api/query`, {
        data: {
            path: 'cabins:listPublished',
            args: { paginationOpts: { numItems: 1, cursor: null } },
            format: 'json',
        },
    });
    const { value: cabinsPage } = (await cabinsResponse.json()) as {
        value: { page: { _id: string }[] };
    };
    const cabinId = cabinsPage.page[0]!._id;

    // Randomized within a wide future window -- a fixed offset collides with whatever this
    // same spec booked on a previous run today (this dev deployment persists across runs).
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 400 + Math.floor(Math.random() * 300));
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 2);

    const reservationResponse = await guestRequest.post(`${CONVEX_URL}/api/mutation`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
            path: 'reservations:createDemoReservation',
            args: {
                cabinId,
                checkIn: checkIn.toISOString().slice(0, 10),
                checkOut: checkOut.toISOString().slice(0, 10),
                guests: 1,
            },
            format: 'json',
        },
    });
    expect(reservationResponse.ok()).toBe(true);
    const reservationBody = (await reservationResponse.json()) as { status: string };
    expect(reservationBody.status).toBe('success');
    await guestRequest.dispose();

    // The bookings table only renders its most recent page by default, and this dev
    // deployment accumulates rows across every e2e/manual run -- search by the fixture
    // guest's email (the table's own search-by-guest feature) rather than relying on
    // default ordering to surface this specific reservation.
    await page.goto('/admin/bookings');
    await page.getByLabel('Search').fill('e2e-fixture-guest@example.com');
    await expect(page.getByText('E2E Fixture Guest').first()).toBeVisible();
});
