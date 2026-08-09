import { MINUTE, RateLimiter } from '@convex-dev/rate-limiter';

import { components } from '../_generated/api';

/** Per docs/convex/_generated/ai/guidelines.md: hand-rolled counter/window-scan rate limits
 *  admit races under concurrency and lose quota when a mutation fails -- use this component. */
export const rateLimiter = new RateLimiter(components.rateLimiter, {
    contactMessage: { kind: 'fixed window', rate: 1, period: MINUTE },
});
