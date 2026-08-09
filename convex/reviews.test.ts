import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import { internal } from './_generated/api';
import type { Id } from './_generated/dataModel';
import schema from './schema';

const modules = import.meta.glob('./**/*.ts');

async function seedCabin(t: ReturnType<typeof convexTest>): Promise<Id<'cabins'>> {
    const coverImage = await t.run((ctx) =>
        ctx.storage.store(new Blob(['fake-image'], { type: 'image/jpeg' })),
    );

    return await t.run((ctx) =>
        ctx.db.insert('cabins', {
            name: 'Pine Ridge Cabin',
            slug: 'pine-ridge-cabin',
            shortDescription: 'A quiet cabin in the woods.',
            description: 'A longer description of a quiet cabin in the woods.',
            location: 'Pine Ridge',
            nightlyRate: 25000,
            cleaningFee: 3500,
            maxGuests: 4,
            bedrooms: 2,
            beds: 3,
            bathrooms: 1,
            coverImage,
            galleryImages: [coverImage],
            amenities: [],
            published: true,
            featured: false,
            createdAt: 1700000000000,
            updatedAt: 1700000000000,
        }),
    );
}

function reviewInput(overrides: { userId: string; rating?: number; createdAt?: number }) {
    return {
        userId: overrides.userId,
        authorName: 'Jamie Alder',
        rating: overrides.rating ?? 5,
        comment: 'Loved it.',
        createdAt: overrides.createdAt ?? 1700000000000,
    };
}

describe('seedReviews', () => {
    test('clear-then-reinserts -- a re-run replaces the review set, not appends', async () => {
        const t = convexTest(schema, modules);
        const cabinId = await seedCabin(t);

        await t.mutation(internal.reviews.seedReviews, {
            cabinId,
            reviews: [reviewInput({ userId: 'seed-guest-1' })],
        });
        await t.mutation(internal.reviews.seedReviews, {
            cabinId,
            reviews: [
                reviewInput({ userId: 'seed-guest-2' }),
                reviewInput({ userId: 'seed-guest-3' }),
            ],
        });

        const stored = await t.run((ctx) =>
            ctx.db
                .query('reviews')
                .withIndex('by_cabinId', (q) => q.eq('cabinId', cabinId))
                .collect(),
        );

        expect(stored.map((r) => r.userId).sort()).toEqual(['seed-guest-2', 'seed-guest-3']);
    });

    test('rejects an unknown cabin id', async () => {
        const t = convexTest(schema, modules);
        const cabinId = await seedCabin(t);
        await t.run((ctx) => ctx.db.delete(cabinId));

        await expect(
            t.mutation(internal.reviews.seedReviews, {
                cabinId,
                reviews: [reviewInput({ userId: 'seed-guest-1' })],
            }),
        ).rejects.toThrow();
    });

    test('rejects a rating below the valid range and leaves existing reviews untouched', async () => {
        const t = convexTest(schema, modules);
        const cabinId = await seedCabin(t);

        await t.mutation(internal.reviews.seedReviews, {
            cabinId,
            reviews: [reviewInput({ userId: 'seed-guest-1' })],
        });

        await expect(
            t.mutation(internal.reviews.seedReviews, {
                cabinId,
                reviews: [reviewInput({ userId: 'seed-guest-2', rating: 0 })],
            }),
        ).rejects.toThrow();

        const stored = await t.run((ctx) =>
            ctx.db
                .query('reviews')
                .withIndex('by_cabinId', (q) => q.eq('cabinId', cabinId))
                .collect(),
        );
        expect(stored.map((r) => r.userId)).toEqual(['seed-guest-1']);
    });

    test('rejects an out-of-range rating', async () => {
        const t = convexTest(schema, modules);
        const cabinId = await seedCabin(t);

        await expect(
            t.mutation(internal.reviews.seedReviews, {
                cabinId,
                reviews: [reviewInput({ userId: 'seed-guest-1', rating: 6 })],
            }),
        ).rejects.toThrow();
    });

    test('rejects a non-integer rating', async () => {
        const t = convexTest(schema, modules);
        const cabinId = await seedCabin(t);

        await expect(
            t.mutation(internal.reviews.seedReviews, {
                cabinId,
                reviews: [reviewInput({ userId: 'seed-guest-1', rating: 4.5 })],
            }),
        ).rejects.toThrow();
    });
});
