import { expect, test as setup } from '@playwright/test';
import { execFileSync } from 'node:child_process';

/**
 * Playwright's `setup` project (docs/02_CODING_GUIDELINES.md §18: "build an authenticated
 * fixture early ... or every screen behind auth is untestable"). Seeds a fixed guest and admin
 * user via the same `testHelpers:seedAuthenticatedUser` internal mutation this session's manual
 * Phase 8/9 e2e verification used, then drives the REAL `/sign-in` form (not an API shortcut) --
 * this doubles as continuous proof the sign-in form itself works, and there's no way to land a
 * valid Better Auth session cookie without going through `authClient` regardless.
 */

const GUEST = {
    email: 'e2e-fixture-guest@example.com',
    password: 'TestPass123!',
    name: 'E2E Fixture Guest',
};
const ADMIN = {
    email: 'e2e-fixture-admin@example.com',
    password: 'TestPass123!',
    name: 'E2E Fixture Admin',
    role: 'admin',
};

function seedUser(user: Record<string, string>) {
    try {
        execFileSync(
            'bunx',
            ['convex', 'run', 'testHelpers:seedAuthenticatedUser', JSON.stringify(user)],
            { stdio: 'pipe' },
        );
    } catch {
        // Better Auth's sign-up throws for a duplicate email -- idempotent by design (the
        // dev server may already have this user from a previous local run), so a failure
        // here just means the user already exists and sign-in below will still work.
    }
}

setup('authenticate as guest', async ({ page }) => {
    seedUser(GUEST);

    await page.goto('/sign-in');
    await page.getByLabel('Email').fill(GUEST.email);
    await page.getByLabel('Password').fill(GUEST.password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    await page.waitForURL('/guest-area');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page.context().storageState({ path: 'e2e/.auth/guest.json' });
});

setup('authenticate as admin', async ({ page }) => {
    seedUser(ADMIN);

    await page.goto('/sign-in');
    await page.getByLabel('Email').fill(ADMIN.email);
    await page.getByLabel('Password').fill(ADMIN.password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    await page.waitForURL('/admin');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page.context().storageState({ path: 'e2e/.auth/admin.json' });
});
