import { v } from 'convex/values';

/** Spec §72's closed amenity-category vocabulary. */
export const AMENITY_CATEGORY = {
    ESSENTIALS: 'essentials',
    KITCHEN: 'kitchen',
    OUTDOOR: 'outdoor',
    COMFORT: 'comfort',
    ENTERTAINMENT: 'entertainment',
    ACCESSIBILITY: 'accessibility',
} as const;

export type AmenityCategory = (typeof AMENITY_CATEGORY)[keyof typeof AMENITY_CATEGORY];

export const amenityCategoryValidator = v.union(
    v.literal(AMENITY_CATEGORY.ESSENTIALS),
    v.literal(AMENITY_CATEGORY.KITCHEN),
    v.literal(AMENITY_CATEGORY.OUTDOOR),
    v.literal(AMENITY_CATEGORY.COMFORT),
    v.literal(AMENITY_CATEGORY.ENTERTAINMENT),
    v.literal(AMENITY_CATEGORY.ACCESSIBILITY),
);
