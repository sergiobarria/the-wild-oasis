import { v } from 'convex/values';

import { internalMutation, query } from './_generated/server';
import { AMENITY_CATEGORY, amenityCategoryValidator } from './lib/amenities';

export { AMENITY_CATEGORY };

const amenityValidator = v.object({
    _id: v.id('amenities'),
    _creationTime: v.number(),
    name: v.string(),
    icon: v.string(),
    category: amenityCategoryValidator,
});

/**
 * All amenities. Unpaginated `.collect()` is deliberate -- this is a small,
 * admin-curated catalog table (~26 rows), not user-generated data.
 */
export const list = query({
    args: {},
    returns: v.array(amenityValidator),
    handler: async (ctx) => {
        return await ctx.db.query('amenities').collect();
    },
});

/**
 * The 26-item curated amenity set from `lib/amenity-icons.ts`
 * (only amenities with a clean Lucide icon match), mapped onto spec §72's six
 * categories. Can't import that file directly -- it pulls in `lucide-react`,
 * a frontend dependency `convex/` shouldn't bundle -- so keep the two lists
 * in sync by eye.
 */
const AMENITY_SEED: ReadonlyArray<{
    name: string;
    icon: string;
    category: (typeof AMENITY_CATEGORY)[keyof typeof AMENITY_CATEGORY];
}> = [
    { name: 'WiFi', icon: 'Wifi', category: AMENITY_CATEGORY.ESSENTIALS },
    { name: 'Air Conditioner', icon: 'Snowflake', category: AMENITY_CATEGORY.ESSENTIALS },
    { name: 'Washer', icon: 'WashingMachine', category: AMENITY_CATEGORY.ESSENTIALS },
    { name: 'Workspace', icon: 'BriefcaseBusiness', category: AMENITY_CATEGORY.ESSENTIALS },
    { name: 'Smoke Detector', icon: 'AlarmSmoke', category: AMENITY_CATEGORY.ESSENTIALS },
    { name: 'First Aid Kit', icon: 'BriefcaseMedical', category: AMENITY_CATEGORY.ESSENTIALS },
    { name: 'Security Cameras', icon: 'Cctv', category: AMENITY_CATEGORY.ESSENTIALS },
    { name: 'Crib', icon: 'Baby', category: AMENITY_CATEGORY.ESSENTIALS },

    { name: 'Kitchen', icon: 'ChefHat', category: AMENITY_CATEGORY.KITCHEN },
    { name: 'Coffee Maker', icon: 'Coffee', category: AMENITY_CATEGORY.KITCHEN },

    { name: 'Swimming Pool', icon: 'WavesLadder', category: AMENITY_CATEGORY.OUTDOOR },
    { name: 'Grill / BBQ', icon: 'FlameKindling', category: AMENITY_CATEGORY.OUTDOOR },
    { name: 'Outdoor Shower', icon: 'ShowerHead', category: AMENITY_CATEGORY.OUTDOOR },
    { name: 'Ocean View', icon: 'Waves', category: AMENITY_CATEGORY.OUTDOOR },
    { name: 'Garden', icon: 'Leaf', category: AMENITY_CATEGORY.OUTDOOR },

    { name: 'Fireplace', icon: 'Flame', category: AMENITY_CATEGORY.COMFORT },
    { name: 'Hot Tub', icon: 'Sparkles', category: AMENITY_CATEGORY.COMFORT },
    { name: 'Gym', icon: 'Dumbbell', category: AMENITY_CATEGORY.COMFORT },
    { name: 'Pet Friendly', icon: 'PawPrint', category: AMENITY_CATEGORY.COMFORT },

    { name: 'TV / Streaming', icon: 'Tv', category: AMENITY_CATEGORY.ENTERTAINMENT },
    { name: 'Board Games', icon: 'Dices', category: AMENITY_CATEGORY.ENTERTAINMENT },
    { name: 'Books & Magazines', icon: 'Book', category: AMENITY_CATEGORY.ENTERTAINMENT },

    { name: 'Parking', icon: 'CircleParking', category: AMENITY_CATEGORY.ACCESSIBILITY },
    { name: 'Bicycle Rental', icon: 'Bike', category: AMENITY_CATEGORY.ACCESSIBILITY },
    { name: 'Electric Vehicle Charger', icon: 'PlugZap', category: AMENITY_CATEGORY.ACCESSIBILITY },
    { name: 'Private Entrance', icon: 'DoorOpen', category: AMENITY_CATEGORY.ACCESSIBILITY },
];

/** Idempotent by name -- safe to call from tests, the seed script, or an already-seeded deployment. */
export const seedAmenities = internalMutation({
    args: {},
    returns: v.array(v.id('amenities')),
    handler: async (ctx) => {
        const ids = [];

        for (const amenity of AMENITY_SEED) {
            const existing = await ctx.db
                .query('amenities')
                .withIndex('by_name', (q) => q.eq('name', amenity.name))
                .unique();

            ids.push(existing ? existing._id : await ctx.db.insert('amenities', amenity));
        }

        return ids;
    },
});
