import { useEffect, useState } from 'react';

/**
 * Delays reacting to a fast-changing value (e.g. search input) by `delayMs` -- unlike nuqs'
 * `limitUrlUpdates: debounce(...)`, which only throttles the *URL write* and still updates the
 * returned state (and therefore anything reading it, like a `useQuery` call) on every
 * keystroke. Read the debounced return value, not the raw input, wherever a debounced Convex
 * query is the actual goal.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timeout = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(timeout);
    }, [value, delayMs]);

    return debounced;
}
