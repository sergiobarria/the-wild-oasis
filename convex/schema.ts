import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

import { amenityCategoryValidator } from './lib/amenities';

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
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index('by_slug', ['slug'])
        .index('by_published', ['published']),
});
