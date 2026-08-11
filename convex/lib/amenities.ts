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

/**
 * The closed set of Lucide icon names an amenity's `icon` field may hold -- kept in sync
 * by eye with `lib/amenity-icons.ts`'s imports (this file can't import `lucide-react`
 * itself, a frontend dependency `convex/` shouldn't bundle). Never executed, only ever
 * used as a lookup key (spec §72) -- validating it server-side keeps that a real
 * invariant, not just a UI convention.
 */
export const AMENITY_ICON_NAMES = [
    'Wifi',
    'Snowflake',
    'WashingMachine',
    'BriefcaseBusiness',
    'AlarmSmoke',
    'BriefcaseMedical',
    'Cctv',
    'Baby',
    'ChefHat',
    'Coffee',
    'WavesLadder',
    'FlameKindling',
    'ShowerHead',
    'Waves',
    'Leaf',
    'Flame',
    'Sparkles',
    'Dumbbell',
    'PawPrint',
    'Tv',
    'Dices',
    'Book',
    'CircleParking',
    'Bike',
    'PlugZap',
    'DoorOpen',
] as const;

export type AmenityIconName = (typeof AMENITY_ICON_NAMES)[number];

export const amenityIconValidator = v.union(...AMENITY_ICON_NAMES.map((name) => v.literal(name)));
