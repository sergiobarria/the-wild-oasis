import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

import { amenityCategoryValidator } from './lib/amenities';
import { paymentStatusValidator, reservationStatusValidator } from './lib/reservations';

export default defineSchema({
    amenities: defineTable({
        name: v.string(),
        /** Opaque lookup key into the frontend's Lucide icon map -- never executed (spec §72). */
        icon: v.string(),
        category: amenityCategoryValidator,
    })
        .index('by_name', ['name'])
        .index('by_category', ['category']),

    cabins: defineTable({
        name: v.string(),
        slug: v.string(),
        shortDescription: v.string(),
        description: v.string(),
        location: v.string(),
        /** Internal-only per spec §69 -- never returned by a public query. */
        address: v.optional(v.string()),
        /** Integer cents. See convex/lib/money.ts. */
        nightlyRate: v.number(),
        cleaningFee: v.number(),
        maxGuests: v.number(),
        bedrooms: v.number(),
        beds: v.number(),
        bathrooms: v.number(),
        coverImage: v.id('_storage'),
        galleryImages: v.array(v.id('_storage')),
        amenities: v.array(v.id('amenities')),
        published: v.boolean(),
        /** Admin-curated pick for the home page's Featured Cabins section (spec §24). */
        featured: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_slug', ['slug'])
        .index('by_published_and_featured', ['published', 'featured']),

    reviews: defineTable({
        cabinId: v.id('cabins'),
        /** Shaped like a real Better Auth identity (`identity.subject`, see
         *  convex/model/auth.ts's `requireUser`) for when a real review-writing flow
         *  lands -- Better Auth's `user` table is owned by an isolated Convex component, so
         *  this can never be a native `v.id()` reference, only a string in its shape. Seeded
         *  rows use a synthetic, non-account-backed value paired with a denormalized
         *  `authorName`/`authorImage` snapshot -- not a real, sign-in-able reviewer. */
        userId: v.string(),
        authorName: v.string(),
        authorImage: v.optional(v.string()),
        /** Integer 1-5. See convex/lib/reviews.ts's `assertValidRating`. */
        rating: v.number(),
        comment: v.string(),
        createdAt: v.number(),
    }).index('by_cabinId', ['cabinId']),

    reservations: defineTable({
        cabinId: v.id('cabins'),
        /** Shaped like a real Better Auth identity (`identity.subject`), same reasoning as
         *  `reviews.userId` -- Better Auth's `user` table is owned by an isolated Convex
         *  component, so this can never be a native `v.id()` reference. */
        guestId: v.string(),
        /** ISO 'YYYY-MM-DD' calendar-day strings, half-open range. See
         *  features/availability/availability-domain.ts. */
        checkIn: v.string(),
        checkOut: v.string(),
        guests: v.number(),
        status: reservationStatusValidator,
        paymentStatus: paymentStatusValidator,
        paymentRequired: v.boolean(),
        /** Integer cents, snapshotted at booking time -- never re-derived from the live cabin
         *  (docs/02_CODING_GUIDELINES.md §7): a later change to the cabin's nightly rate must
         *  not affect an existing reservation's stored total. */
        pricing: v.object({
            nightlySubtotal: v.number(),
            cleaningFee: v.number(),
            /** No tax engine exists yet (spec §4) -- always 0 for now. */
            taxes: v.number(),
            total: v.number(),
        }),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_guestId', ['guestId'])
        .index('by_cabinId_and_status', ['cabinId', 'status']),

    featureFlags: defineTable({
        /** e.g. 'stripePaymentsEnabled'. The lookup key `isFeatureEnabled` reads by. */
        key: v.string(),
        name: v.string(),
        description: v.string(),
        enabled: v.boolean(),
        updatedAt: v.number(),
        /** Better Auth identity.subject of the admin who last toggled this flag. Absent on a
         *  seed-created row that's never been touched by an admin. */
        updatedBy: v.optional(v.string()),
    }).index('by_key', ['key']),
});
