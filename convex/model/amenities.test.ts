import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import schema from '../schema';
import { listAmenities, resolveAmenityCards, seedAmenities } from './amenities';

const modules = import.meta.glob('../**/*.ts');

describe('listAmenities', () => {
    test('returns an empty list when nothing is seeded', async () => {
        const t = convexTest(schema, modules);
        const result = await t.run((ctx) => listAmenities(ctx));
        expect(result).toEqual([]);
    });

    test('returns every seeded amenity', async () => {
        const t = convexTest(schema, modules);
        await t.run((ctx) => seedAmenities(ctx));

        const result = await t.run((ctx) => listAmenities(ctx));
        expect(result.length).toBeGreaterThan(0);
        expect(result.map((amenity) => amenity.name)).toContain('WiFi');
    });
});

describe('resolveAmenityCards', () => {
    test('returns an empty array for an empty id list', async () => {
        const t = convexTest(schema, modules);
        const result = await t.run((ctx) => resolveAmenityCards(ctx, []));
        expect(result).toEqual([]);
    });

    test('resolves ids to their display shape, dropping any unknown id', async () => {
        const t = convexTest(schema, modules);
        const [wifiId] = await t.run((ctx) => seedAmenities(ctx));
        const deletedId = await t.run((ctx) =>
            ctx.db.insert('amenities', { name: 'Temp', icon: 'Wifi', category: 'comfort' }),
        );
        await t.run((ctx) => ctx.db.delete(deletedId));

        const result = await t.run((ctx) => resolveAmenityCards(ctx, [wifiId!, deletedId]));

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({ _id: wifiId, name: 'WiFi', icon: 'Wifi' });
    });
});

describe('seedAmenities', () => {
    test('is idempotent by name -- a second run does not create duplicates', async () => {
        const t = convexTest(schema, modules);

        const first = await t.run((ctx) => seedAmenities(ctx));
        const second = await t.run((ctx) => seedAmenities(ctx));

        expect(second).toEqual(first);
        const rows = await t.run((ctx) => ctx.db.query('amenities').collect());
        expect(rows).toHaveLength(first.length);
    });
});
