import { describe, expect, it } from 'vitest';

import { firstSearchParam } from './search-params';

describe('firstSearchParam', () => {
    it('returns a single value unchanged', () => {
        expect(firstSearchParam('cabin-1')).toBe('cabin-1');
    });

    it('returns the first value of a repeated param', () => {
        expect(firstSearchParam(['cabin-1', 'cabin-2'])).toBe('cabin-1');
    });

    it('returns undefined when the param is absent', () => {
        expect(firstSearchParam(undefined)).toBeUndefined();
    });
});
