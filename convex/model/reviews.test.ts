import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import { internal } from '../_generated/api';
import type { Id } from '../_generated/dataModel';
import schema from '../schema';
import { resolveReviewsForCabin } from './reviews';

const modules = import.meta.glob('../**/*.ts');

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

describe('resolveReviewsForCabin', () => {
    test('returns an empty summary for a cabin with no reviews', async () => {
        const t = convexTest(schema, modules);
        const cabinId = await seedCabin(t);

        const result = await t.run((ctx) => resolveReviewsForCabin(ctx, cabinId));

        expect(result).toEqual({ reviews: [], averageRating: null, reviewCount: 0 });
    });

    test('orders by createdAt, not insertion order', async () => {
        const t = convexTest(schema, modules);
        const cabinId = await seedCabin(t);

        // Inserted in ascending createdAt order -- `by_cabinId` alone would sort by
        // insertion/_creationTime, which happens to match here, so insert the OLDER
        // createdAt second to prove the sort is explicit, not incidental.
        await t.mutation(internal.reviews.seedReviews, {
            cabinId,
            reviews: [
                reviewInput({ userId: 'seed-guest-newer', createdAt: 1700000002000 }),
                reviewInput({ userId: 'seed-guest-older', createdAt: 1700000001000 }),
            ],
        });

        const result = await t.run((ctx) => resolveReviewsForCabin(ctx, cabinId));

        expect(result.reviews.map((r) => r.createdAt)).toEqual([1700000002000, 1700000001000]);
    });

    test('computes the average rating', async () => {
        const t = convexTest(schema, modules);
        const cabinId = await seedCabin(t);

        await t.mutation(internal.reviews.seedReviews, {
            cabinId,
            reviews: [
                reviewInput({ userId: 'seed-guest-1', rating: 5 }),
                reviewInput({ userId: 'seed-guest-2', rating: 2 }),
            ],
        });

        const result = await t.run((ctx) => resolveReviewsForCabin(ctx, cabinId));

        expect(result.averageRating).toBe(3.5);
        expect(result.reviewCount).toBe(2);
    });
});
