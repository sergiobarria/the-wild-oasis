import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';

/**
 * Accessibility pass (WO-069, spec §18: WCAG 2.1 AA "where reasonably achievable"). Runs on
 * every `bun run test:e2e` invocation (CI included) rather than a one-off audit, so a
 * regression is caught automatically instead of only being checked once for this phase.
 *
 * Only critical/serious violations fail the build on this first pass -- moderate/minor
 * findings are logged (visible in the test output) without blocking, since some of those are
 * pre-existing shadcn/Radix-level nits outside this app's direct control. Tighten this once a
 * baseline is established.
 */
const BLOCKING_IMPACTS = new Set(['critical', 'serious']);

async function checkPage(page: Page, path: string) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    const blocking = results.violations.filter(
        (violation) => violation.impact && BLOCKING_IMPACTS.has(violation.impact),
    );
    const nonBlocking = results.violations.filter((violation) => !blocking.includes(violation));

    if (nonBlocking.length > 0) {
        console.log(
            `[a11y] ${path}: ${nonBlocking.length} non-blocking violation(s) -- ${nonBlocking.map((v) => v.id).join(', ')}`,
        );
    }

    expect(blocking, blocking.map((v) => `${v.id}: ${v.help}`).join('\n')).toEqual([]);
}

test.describe('public pages', () => {
    test.beforeEach(async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium', 'unauthenticated only');
    });

    const PUBLIC_PAGES: [string, string][] = [
        ['home', '/'],
        ['cabins list', '/cabins'],
        ['cabin detail (booking panel)', '/cabins/hidden-creek'],
        ['about', '/about'],
        ['contact', '/contact'],
        ['sign in', '/sign-in'],
        ['sign up', '/sign-up'],
    ];

    for (const [name, path] of PUBLIC_PAGES) {
        test(name, async ({ page }) => {
            await checkPage(page, path);
        });
    }
});

test.describe('guest dashboard', () => {
    test.beforeEach(async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-guest', 'guest project only');
    });

    const GUEST_PAGES: [string, string][] = [
        ['guest area home', '/guest-area'],
        ['guest bookings', '/guest-area/bookings'],
        ['guest profile', '/guest-area/profile'],
    ];

    for (const [name, path] of GUEST_PAGES) {
        test(name, async ({ page }) => {
            await checkPage(page, path);
        });
    }
});

test.describe('admin', () => {
    test.beforeEach(async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-admin', 'admin project only');
    });

    const ADMIN_PAGES: [string, string][] = [
        ['admin dashboard', '/admin'],
        ['admin cabins list', '/admin/cabins'],
        ['admin cabin create form', '/admin/cabins/new'],
        ['admin bookings', '/admin/bookings'],
        ['admin users', '/admin/users'],
        ['admin messages', '/admin/messages'],
    ];

    for (const [name, path] of ADMIN_PAGES) {
        test(name, async ({ page }) => {
            await checkPage(page, path);
        });
    }
});
