import { describe, expect, test } from 'vitest';

import robots from './robots';

describe('robots', () => {
    test('disallows every crawler from every path', () => {
        expect(robots()).toEqual({
            rules: { userAgent: '*', disallow: '/' },
        });
    });
});
