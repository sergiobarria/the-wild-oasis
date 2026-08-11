import { ConvexError } from 'convex/values';

import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import { AMENITY_CATEGORY, type AmenityCategory, type AmenityIconName } from '../lib/amenities';
import { requireAdmin } from './auth';

/**
 * All amenities. Unpaginated `.collect()` is deliberate -- this is a small,
 * admin-curated catalog table (~26 rows), not user-generated data.
 */
export async function listAmenities(ctx: QueryCtx) {
    return await ctx.db.query('amenities').collect();
}

/** Admin-gated mirror of `listAmenities` (WO-073) -- kept separate rather than reused so
 *  the public `list` stays unauthenticated, matching `listPublished` vs `adminListCabins`. */
export async function adminListAmenities(ctx: QueryCtx) {
    await requireAdmin(ctx);

    return await ctx.db.query('amenities').collect();
}

async function assertUniqueName(
    ctx: QueryCtx,
    name: string,
    excludingAmenityId?: Id<'amenities'>,
): Promise<void> {
    const existing = await ctx.db
        .query('amenities')
        .withIndex('by_name', (q) => q.eq('name', name))
        .unique();

    if (existing && existing._id !== excludingAmenityId) {
        throw new ConvexError(`An amenity named "${name}" already exists.`);
    }
}

type AdminAmenityInput = {
    name: string;
    icon: AmenityIconName;
    category: AmenityCategory;
};

/** Admin amenity catalog management (WO-073) -- name uniqueness enforced the same way
 *  cabin slugs are (`assertUniqueSlug` in `./cabins.ts`). */
export async function adminCreateAmenity(ctx: MutationCtx, args: AdminAmenityInput) {
    await requireAdmin(ctx);

    await assertUniqueName(ctx, args.name);

    return await ctx.db.insert('amenities', args);
}

export async function adminUpdateAmenity(
    ctx: MutationCtx,
    args: { amenityId: Id<'amenities'> } & AdminAmenityInput,
) {
    await requireAdmin(ctx);

    const { amenityId, ...fields } = args;
    const amenity = await ctx.db.get(amenityId);
    if (!amenity) throw new ConvexError('Unknown amenity.');

    if (fields.name !== amenity.name) {
        await assertUniqueName(ctx, fields.name, amenityId);
    }

    await ctx.db.patch(amenityId, fields);
}

/** Blocks deletion while any cabin still references this amenity, rather than cascading
 *  the removal -- mirrors this codebase's generally cautious stance toward
 *  cross-entity references (cabins themselves are never hard-deleted, only unpublished).
 *  Cabins are a small, `.collect()`-tolerant table (~8 rows) elsewhere in this codebase
 *  (see `listAmenities`'s own reasoning), so scanning them here is cheap. */
export async function adminDeleteAmenity(ctx: MutationCtx, args: { amenityId: Id<'amenities'> }) {
    await requireAdmin(ctx);

    const amenity = await ctx.db.get(args.amenityId);
    if (!amenity) throw new ConvexError('Unknown amenity.');

    const cabins = await ctx.db.query('cabins').collect();
    const referencingCount = cabins.filter((cabin) =>
        cabin.amenities.includes(args.amenityId),
    ).length;

    if (referencingCount > 0) {
        throw new ConvexError(
            `This amenity is used by ${referencingCount} cabin${referencingCount === 1 ? '' : 's'}. Remove it from ${referencingCount === 1 ? 'that cabin' : 'those cabins'} first.`,
        );
    }

    await ctx.db.delete(args.amenityId);
}

/** Shared by `cabins.ts`'s `getBySlug` and `listFiltered` -- resolves amenity ids to their display shape. */
export async function resolveAmenityCards(ctx: QueryCtx, amenityIds: Id<'amenities'>[]) {
    const amenityDocs = await Promise.all(amenityIds.map((id) => ctx.db.get(id)));

    return amenityDocs
        .filter((amenity) => amenity !== null)
        .map((amenity) => ({
            _id: amenity._id,
            name: amenity.name,
            icon: amenity.icon,
            category: amenity.category,
        }));
}

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
export async function seedAmenities(ctx: MutationCtx) {
    const ids = [];

    for (const amenity of AMENITY_SEED) {
        const existing = await ctx.db
            .query('amenities')
            .withIndex('by_name', (q) => q.eq('name', amenity.name))
            .unique();

        ids.push(existing ? existing._id : await ctx.db.insert('amenities', amenity));
    }

    return ids;
}
