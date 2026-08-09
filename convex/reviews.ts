import { type Infer, v } from 'convex/values';

import { internalMutation } from './_generated/server';
import * as Reviews from './model/reviews';

export const reviewValidator = v.object({
    _id: v.id('reviews'),
    rating: v.number(),
    comment: v.string(),
    authorName: v.string(),
    authorImage: v.optional(v.string()),
    createdAt: v.number(),
});

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

export type SeedReviewInput = Infer<typeof seedReviewValidator>;

export const seedReviews = internalMutation({
    args: { cabinId: v.id('cabins'), reviews: v.array(seedReviewValidator) },
    returns: v.null(),
    handler: async (ctx, args) => {
        await Reviews.seedReviewsForCabin(ctx, args);
        return null;
    },
});
