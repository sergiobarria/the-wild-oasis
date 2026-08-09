/**
 * Seeds the feature flags spec §40-42 requires to exist from day one. Insert-only (see
 * `convex/model/featureFlags.ts`'s `seedFeatureFlags`) -- safe to re-run on every deploy without
 * resetting an admin's runtime toggle.
 *
 * Talks to Convex via `bunx convex run`, same reasoning as `seed-cabins.ts`.
 *
 * Usage: `bun run seed:feature-flags`
 */
import { execFileSync } from 'node:child_process';

function runConvex(fn: string, args: unknown = {}): unknown {
    const output = execFileSync('bunx', ['convex', 'run', fn, JSON.stringify(args)], {
        encoding: 'utf-8',
    });
    return output.trim() ? JSON.parse(output) : null;
}

const FLAGS = [
    {
        key: 'stripePaymentsEnabled',
        name: 'Stripe payments',
        description:
            'When off, checkout uses the demo confirmation path (no payment collected) instead of Stripe Checkout.',
        enabled: false,
    },
];

const ids = runConvex('featureFlags:seedFeatureFlags', { flags: FLAGS }) as string[];
console.log(`Done -- ${ids.length} feature flag(s) synced.`);
