import { ConvexError, v } from 'convex/values';

import type { Id } from './_generated/dataModel';
import { internalMutation, type QueryCtx } from './_generated/server';

export const reviewValidator = v.object({
    _id: v.id('reviews'),
    rating: v.number(),
    comment: v.string(),
    authorName: v.string(),
    authorImage: v.optional(v.string()),
    createdAt: v.number(),
});

// Generous bound, same reasoning as cabins.ts's LISTING_RESULT_CAP -- never `.collect()`
// unbounded, `.take()` instead.
const REVIEWS_PER_CABIN_CAP = 50;

/**
 * Used by `cabins.ts`'s `getBySlug`. No live user join -- the row already has everything to
 * display, denormalized at write time (see the `reviews` table's doc comment in schema.ts for
 * why: seeded reviews aren't backed by real, sign-in-able accounts).
 */
export async function resolveReviewsForCabin(ctx: QueryCtx, cabinId: Id<'cabins'>) {
    const reviews = await ctx.db
        .query('reviews')
        .withIndex('by_cabinId', (q) => q.eq('cabinId', cabinId))
        .take(REVIEWS_PER_CABIN_CAP);

    // `by_cabinId` only indexes `cabinId` -- every matched row shares the same value, so
    // `.order()` would sort by `_creationTime` (insertion order), not the `createdAt` the
    // reviews actually carry. Sort explicitly; the set is already bounded above.
    reviews.sort((a, b) => b.createdAt - a.createdAt);

    // Intentionally unrounded (e.g. 3 ratings summing to 10 -> 3.3333...) -- formatting to a
    // display precision is the frontend's job, not baked into the stored/returned value.
    const averageRating = reviews.length
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : null;

    return {
        reviews: reviews.map((review) => ({
            _id: review._id,
            rating: review.rating,
            comment: review.comment,
            authorName: review.authorName,
            authorImage: review.authorImage,
            createdAt: review.createdAt,
        })),
        averageRating,
        reviewCount: reviews.length,
    };
}

/** Enforces an integer 1-5 rating at every write boundary -- never trust a caller-supplied value. */
function assertValidRating(rating: number): void {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new Error(`rating must be an integer between 1 and 5, got ${rating}.`);
    }
}

const seedReviewValidator = v.object({
    /** Shaped like a real Better Auth identity (`identity.subject`) for when a real
     *  review-writing flow lands -- seed callers pass a synthetic, non-account-backed value. */
    userId: v.string(),
    authorName: v.string(),
    authorImage: v.optional(v.string()),
    rating: v.number(),
    comment: v.string(),
    createdAt: v.number(),
});

/**
 * Clear-then-reinsert per cabin (convex-seed skill's idempotency pattern) -- reviews have no
 * natural unique key to upsert against the way cabins upsert by slug, so a re-run replaces a
 * cabin's whole review set with the input rather than merging.
 */
export const seedReviews = internalMutation({
    args: { cabinId: v.id('cabins'), reviews: v.array(seedReviewValidator) },
    returns: v.null(),
    handler: async (ctx, args) => {
        if (!(await ctx.db.get(args.cabinId))) {
            throw new ConvexError(`Unknown cabin id "${args.cabinId}".`);
        }

        // Validate the whole batch up front -- fails fast before any write happens, rather
        // than relying on (correct, but non-obvious) mutation-rollback atomicity to undo a
        // partially-applied delete+insert if a later review in the array turns out invalid.
        args.reviews.forEach((review) => assertValidRating(review.rating));

        const existing = await ctx.db
            .query('reviews')
            .withIndex('by_cabinId', (q) => q.eq('cabinId', args.cabinId))
            .take(REVIEWS_PER_CABIN_CAP);

        await Promise.all(existing.map((review) => ctx.db.delete(review._id)));

        for (const review of args.reviews) {
            await ctx.db.insert('reviews', { cabinId: args.cabinId, ...review });
        }

        return null;
    },
});
