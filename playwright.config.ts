import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PORT ?? 3000);
// Better Auth's trusted-origin check is configured for `localhost` (SITE_URL on the Convex
// deployment) -- 127.0.0.1, though it resolves to the same server, sends a different Origin
// header and gets rejected with "Invalid origin".
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: process.env.CI ? [['html'], ['github']] : [['html']],
    timeout: 30_000,
    use: {
        baseURL,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'setup',
            testMatch: /.*\.setup\.ts/,
        },
        {
            // Unauthenticated -- also runs guest-flow.spec.ts, which signs up a brand-new
            // account itself and must NOT start from a pre-authenticated context (sign-up
            // redirects an already-signed-in visitor away before the flow can run).
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
            testMatch: /(smoke|guest-flow|accessibility)\.spec\.ts/,
        },
        {
            name: 'chromium-guest',
            use: { ...devices['Desktop Chrome'], storageState: 'e2e/.auth/guest.json' },
            dependencies: ['setup'],
            testMatch: /accessibility\.spec\.ts/,
        },
        {
            name: 'chromium-admin',
            use: { ...devices['Desktop Chrome'], storageState: 'e2e/.auth/admin.json' },
            dependencies: ['setup'],
            testMatch: /(admin-flow|accessibility)\.spec\.ts/,
        },
    ],
    webServer: {
        // CI builds in an earlier step; locally this builds on demand.
        command: process.env.CI ? 'bun run start' : 'bun run build && bun run start',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
