import { MINUTE, RateLimiter } from '@convex-dev/rate-limiter';

import { components } from '../_generated/api';

/**
 * Per docs/convex/_generated/ai/guidelines.md: hand-rolled counter/window-scan rate limits
 * admit races under concurrency and lose quota when a mutation fails -- use this component.
 *
 * `token bucket`, not `fixed window`: a fixed window's reset boundary is anchored to a
 * randomized per-key start time, not to the moment of the last submission, so it can't
 * guarantee a minimum gap between two submissions from the same key -- the window can roll
 * over moments after the first one. `capacity: 1` keeps this a strict one-per-minute cooldown
 * (no rollover/burst allowance), matching the UI's "wait a moment" copy.
 */
export const rateLimiter = new RateLimiter(components.rateLimiter, {
    contactMessage: { kind: 'token bucket', rate: 1, period: MINUTE, capacity: 1 },
});
