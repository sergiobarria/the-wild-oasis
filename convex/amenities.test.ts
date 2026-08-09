import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import { api, internal } from './_generated/api';
import schema from './schema';

const modules = import.meta.glob('./**/*.ts');

describe('list', () => {
    test('returns an empty array before seeding', async () => {
        const t = convexTest(schema, modules);

        expect(await t.query(api.amenities.list, {})).toEqual([]);
    });

    test('returns the full canonical set after seeding', async () => {
        const t = convexTest(schema, modules);
        await t.mutation(internal.amenities.seedAmenities, {});

        const amenities = await t.query(api.amenities.list, {});

        expect(amenities.length).toBe(26);
        expect(amenities).toContainEqual(
            expect.objectContaining({ name: 'WiFi', category: 'essentials' }),
        );
    });
});

describe('seedAmenities', () => {
    test('is idempotent -- running it twice does not duplicate rows', async () => {
        const t = convexTest(schema, modules);

        await t.mutation(internal.amenities.seedAmenities, {});
        await t.mutation(internal.amenities.seedAmenities, {});

        const amenities = await t.query(api.amenities.list, {});
        expect(amenities.length).toBe(26);
    });
});
