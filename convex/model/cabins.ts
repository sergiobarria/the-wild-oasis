import type { PaginationOptions } from 'convex/server';
import { ConvexError } from 'convex/values';

import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import { assertIntegerCents } from '../lib/money';
import * as Amenities from './amenities';
import { requireAdmin } from './auth';
import * as Reviews from './reviews';

/**
 * Cover-image cards for spec §26/§27's listing page. Signed URLs only -- the
 * raw `_storage` id never leaves this query. `featuredOnly` narrows to the
 * admin-curated set for the home page's Featured Cabins section (spec §24) --
 * omit it for the full `/cabins` listing.
 */
export async function listPublished(
    ctx: QueryCtx,
    args: { paginationOpts: PaginationOptions; featuredOnly?: boolean },
) {
    // A post-index `.filter()` doesn't reduce rows read, so it can't scale --
    // `by_published_and_featured` lets `featuredOnly` narrow via the index
    // itself instead (a query may supply any prefix of a compound index).
    const result = await ctx.db
        .query('cabins')
        .withIndex('by_published_and_featured', (q) =>
            args.featuredOnly
                ? q.eq('published', true).eq('featured', true)
                : q.eq('published', true),
        )
        .paginate(args.paginationOpts);

    const page = await Promise.all(
        result.page.map(async (cabin) => ({
            _id: cabin._id,
            _creationTime: cabin._creationTime,
            name: cabin.name,
            slug: cabin.slug,
            shortDescription: cabin.shortDescription,
            location: cabin.location,
            nightlyRate: cabin.nightlyRate,
            cleaningFee: cabin.cleaningFee,
            maxGuests: cabin.maxGuests,
            bedrooms: cabin.bedrooms,
            beds: cabin.beds,
            bathrooms: cabin.bathrooms,
            coverImageUrl: await ctx.storage.getUrl(cabin.coverImage),
            published: cabin.published,
            createdAt: cabin.createdAt,
            updatedAt: cabin.updatedAt,
        })),
    );

    return { ...result, page };
}

// Generous bound; the catalog is 8 cabins today -- never `.collect()` unbounded, `.take()`
// instead. Real pagination is a follow-up if the catalog ever outgrows this, not needed for
// spec §26's "avoid a complex marketplace filtering system."
const LISTING_RESULT_CAP = 100;

/**
 * Filtered by name/capacity/price/amenities for spec §26's `/cabins` search controls +
 * optional filters. Not paginated (unlike `listPublished`) -- name and amenity matching
 * can't be expressed by an index or a `.paginate()`-safe `.filter()`, so this narrows in JS
 * on an already `.take()`-bounded page. Correct and complete as long as the number of
 * published cabins matching `guests`/`maxPriceCents` stays under `LISTING_RESULT_CAP`; true
 * for the current catalog size, and spec §26 explicitly rules out marketplace-grade
 * filtering that would need real pagination here.
 */
export async function listFiltered(
    ctx: QueryCtx,
    args: {
        name?: string;
        guests?: number;
        maxPriceCents?: number;
        amenityIds?: Id<'amenities'>[];
    },
) {
    let cabinsQuery = ctx.db
        .query('cabins')
        .withIndex('by_published_and_featured', (q) => q.eq('published', true));

    if (args.guests !== undefined || args.maxPriceCents !== undefined) {
        cabinsQuery = cabinsQuery.filter((q) => {
            const clauses = [
                args.guests !== undefined ? q.gte(q.field('maxGuests'), args.guests) : null,
                args.maxPriceCents !== undefined
                    ? q.lte(q.field('nightlyRate'), args.maxPriceCents)
                    : null,
            ].filter((clause) => clause !== null);

            return clauses.length > 1 ? q.and(...clauses) : clauses[0];
        });
    }

    const cabins = await cabinsQuery.take(LISTING_RESULT_CAP);

    // Name substring and amenity containment (cabin must have ALL selected amenities --
    // AND, not OR) can't be pushed into an index or `.filter()`, so narrow in JS on the
    // already-bounded page.
    const normalizedName = args.name?.trim().toLowerCase();
    const matching = cabins.filter((cabin) => {
        const matchesName = !normalizedName || cabin.name.toLowerCase().includes(normalizedName);
        const matchesAmenities =
            !args.amenityIds?.length || args.amenityIds.every((id) => cabin.amenities.includes(id));

        return matchesName && matchesAmenities;
    });

    return await Promise.all(
        matching.map(async (cabin) => {
            const [coverImageUrl, amenities] = await Promise.all([
                ctx.storage.getUrl(cabin.coverImage),
                Amenities.resolveAmenityCards(ctx, cabin.amenities),
            ]);

            return {
                _id: cabin._id,
                _creationTime: cabin._creationTime,
                name: cabin.name,
                slug: cabin.slug,
                shortDescription: cabin.shortDescription,
                location: cabin.location,
                nightlyRate: cabin.nightlyRate,
                cleaningFee: cabin.cleaningFee,
                maxGuests: cabin.maxGuests,
                bedrooms: cabin.bedrooms,
                beds: cabin.beds,
                bathrooms: cabin.bathrooms,
                coverImageUrl,
                published: cabin.published,
                createdAt: cabin.createdAt,
                updatedAt: cabin.updatedAt,
                amenities,
            };
        }),
    );
}

/**
 * Single cabin by slug, for spec §28's detail page. Returns `null` for an
 * unknown slug OR an unpublished one -- this is an unauthenticated public
 * query, so a draft cabin must never leak here.
 */
export async function getBySlug(ctx: QueryCtx, args: { slug: string }) {
    const cabin = await ctx.db
        .query('cabins')
        .withIndex('by_slug', (q) => q.eq('slug', args.slug))
        .unique();

    if (!cabin || !cabin.published) return null;

    const [coverImageUrl, galleryImageUrls, amenities, reviewData] = await Promise.all([
        ctx.storage.getUrl(cabin.coverImage),
        Promise.all(cabin.galleryImages.map((id) => ctx.storage.getUrl(id))),
        Amenities.resolveAmenityCards(ctx, cabin.amenities),
        Reviews.resolveReviewsForCabin(ctx, cabin._id),
    ]);

    return {
        _id: cabin._id,
        _creationTime: cabin._creationTime,
        name: cabin.name,
        slug: cabin.slug,
        shortDescription: cabin.shortDescription,
        description: cabin.description,
        location: cabin.location,
        nightlyRate: cabin.nightlyRate,
        cleaningFee: cabin.cleaningFee,
        maxGuests: cabin.maxGuests,
        bedrooms: cabin.bedrooms,
        beds: cabin.beds,
        bathrooms: cabin.bathrooms,
        coverImageUrl,
        galleryImageUrls: galleryImageUrls.filter((url) => url !== null),
        amenities,
        published: cabin.published,
        createdAt: cabin.createdAt,
        updatedAt: cabin.updatedAt,
        ...reviewData,
    };
}

/**
 * Single cabin by id, for the checkout summary page (spec §35) -- the booking flow carries a
 * cabin by `_id` through its query params, not by slug. Same leak-prevention rule as
 * `getBySlug`: `null` for an unknown OR unpublished cabin.
 */
export async function getById(ctx: QueryCtx, args: { cabinId: Id<'cabins'> }) {
    const cabin = await ctx.db.get(args.cabinId);

    if (!cabin || !cabin.published) return null;

    return {
        _id: cabin._id,
        name: cabin.name,
        slug: cabin.slug,
        location: cabin.location,
        nightlyRate: cabin.nightlyRate,
        cleaningFee: cabin.cleaningFee,
        maxGuests: cabin.maxGuests,
        coverImageUrl: await ctx.storage.getUrl(cabin.coverImage),
    };
}

async function assertUniqueSlug(
    ctx: QueryCtx,
    slug: string,
    excludingCabinId?: Id<'cabins'>,
): Promise<void> {
    const existing = await ctx.db
        .query('cabins')
        .withIndex('by_slug', (q) => q.eq('slug', slug))
        .unique();

    if (existing && existing._id !== excludingCabinId) {
        throw new ConvexError(`A cabin with the slug "${slug}" already exists.`);
    }
}

function assertNonNegativeInteger(value: number, fieldName: string): void {
    if (!Number.isInteger(value) || value < 0) {
        throw new ConvexError(`${fieldName} must be a whole, non-negative number.`);
    }
}

type AdminCabinInput = {
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    location: string;
    address?: string;
    nightlyRate: number;
    cleaningFee: number;
    maxGuests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    amenityIds: Id<'amenities'>[];
    published: boolean;
    featured: boolean;
    coverImage: Id<'_storage'>;
};

/** Admin cabin creation (WO-048), slug uniqueness enforced (WO-050). `galleryImages` starts
 *  empty -- gallery management is a separate, edit-mode-only feature (WO-049). */
export async function adminCreateCabin(ctx: MutationCtx, args: AdminCabinInput) {
    await requireAdmin(ctx);

    await assertUniqueSlug(ctx, args.slug);
    assertIntegerCents(args.nightlyRate, 'nightlyRate');
    assertIntegerCents(args.cleaningFee, 'cleaningFee');
    assertNonNegativeInteger(args.maxGuests, 'maxGuests');
    assertNonNegativeInteger(args.bedrooms, 'bedrooms');
    assertNonNegativeInteger(args.beds, 'beds');
    assertNonNegativeInteger(args.bathrooms, 'bathrooms');

    const timestamp = Date.now();

    return await ctx.db.insert('cabins', {
        name: args.name,
        slug: args.slug,
        shortDescription: args.shortDescription,
        description: args.description,
        location: args.location,
        address: args.address,
        nightlyRate: args.nightlyRate,
        cleaningFee: args.cleaningFee,
        maxGuests: args.maxGuests,
        bedrooms: args.bedrooms,
        beds: args.beds,
        bathrooms: args.bathrooms,
        coverImage: args.coverImage,
        galleryImages: [],
        amenities: args.amenityIds,
        published: args.published,
        featured: args.featured,
        createdAt: timestamp,
        updatedAt: timestamp,
    });
}

/** Admin cabin edits (WO-048), re-checking slug uniqueness only when the slug actually
 *  changed (WO-050) -- excludes the cabin's own row from the collision check. */
export async function adminUpdateCabin(
    ctx: MutationCtx,
    args: { cabinId: Id<'cabins'> } & Partial<Omit<AdminCabinInput, 'coverImage'>>,
) {
    await requireAdmin(ctx);

    const { cabinId, ...fields } = args;
    const cabin = await ctx.db.get(cabinId);
    if (!cabin) throw new ConvexError('Unknown cabin.');

    if (fields.slug !== undefined && fields.slug !== cabin.slug) {
        await assertUniqueSlug(ctx, fields.slug, cabinId);
    }
    if (fields.nightlyRate !== undefined) assertIntegerCents(fields.nightlyRate, 'nightlyRate');
    if (fields.cleaningFee !== undefined) assertIntegerCents(fields.cleaningFee, 'cleaningFee');
    if (fields.maxGuests !== undefined) assertNonNegativeInteger(fields.maxGuests, 'maxGuests');
    if (fields.bedrooms !== undefined) assertNonNegativeInteger(fields.bedrooms, 'bedrooms');
    if (fields.beds !== undefined) assertNonNegativeInteger(fields.beds, 'beds');
    if (fields.bathrooms !== undefined) assertNonNegativeInteger(fields.bathrooms, 'bathrooms');

    const { amenityIds, ...rest } = fields;

    await ctx.db.patch(cabinId, {
        ...rest,
        ...(amenityIds ? { amenities: amenityIds } : {}),
        updatedAt: Date.now(),
    });
}

/** Kept separate from `adminUpdateCabin` so the list view's publish/unpublish toggle doesn't
 *  need to resubmit the cabin's whole form payload. */
export async function adminSetPublished(
    ctx: MutationCtx,
    args: { cabinId: Id<'cabins'>; published: boolean },
) {
    await requireAdmin(ctx);

    const cabin = await ctx.db.get(args.cabinId);
    if (!cabin) throw new ConvexError('Unknown cabin.');

    await ctx.db.patch(args.cabinId, { published: args.published, updatedAt: Date.now() });
}

/**
 * Every cabin -- published and unpublished alike -- for the admin cabins table. Unlike
 * `listPublished`, this is admin-only, so there's no leak-prevention filtering to apply.
 */
export async function adminListCabins(ctx: QueryCtx, args: { paginationOpts: PaginationOptions }) {
    await requireAdmin(ctx);

    const result = await ctx.db.query('cabins').order('desc').paginate(args.paginationOpts);

    const page = await Promise.all(
        result.page.map(async (cabin) => ({
            _id: cabin._id,
            name: cabin.name,
            slug: cabin.slug,
            nightlyRate: cabin.nightlyRate,
            maxGuests: cabin.maxGuests,
            coverImageUrl: await ctx.storage.getUrl(cabin.coverImage),
            published: cabin.published,
            featured: cabin.featured,
        })),
    );

    return { ...result, page };
}

/** Full cabin record for the admin edit form to preload -- unlike the public queries, includes
 *  `address` and raw amenity ids (the form needs ids to drive its checkboxes, not the resolved
 *  amenity cards `getBySlug` returns for public display). */
export async function adminGetCabin(ctx: QueryCtx, args: { cabinId: Id<'cabins'> }) {
    await requireAdmin(ctx);

    const cabin = await ctx.db.get(args.cabinId);
    if (!cabin) return null;

    const [coverImageUrl, gallery] = await Promise.all([
        ctx.storage.getUrl(cabin.coverImage),
        Promise.all(
            cabin.galleryImages.map(async (storageId) => ({
                storageId,
                url: await ctx.storage.getUrl(storageId),
            })),
        ),
    ]);

    return {
        _id: cabin._id,
        name: cabin.name,
        slug: cabin.slug,
        shortDescription: cabin.shortDescription,
        description: cabin.description,
        location: cabin.location,
        address: cabin.address,
        nightlyRate: cabin.nightlyRate,
        cleaningFee: cabin.cleaningFee,
        maxGuests: cabin.maxGuests,
        bedrooms: cabin.bedrooms,
        beds: cabin.beds,
        bathrooms: cabin.bathrooms,
        // `storageId` alongside the signed `url` -- unlike public queries, this is
        // `requireAdmin`-gated, and the edit form's gallery reorder/remove UI legitimately
        // needs a stable id to submit back to `adminSetGalleryImages`/`adminSetCoverImage`.
        coverImage: { storageId: cabin.coverImage, url: coverImageUrl },
        gallery,
        amenityIds: cabin.amenities,
        published: cabin.published,
        featured: cabin.featured,
        createdAt: cabin.createdAt,
        updatedAt: cabin.updatedAt,
    };
}

/**
 * The real, `requireAdmin`-gated sibling `cabins.ts`'s dev/seed-only `generateUploadUrl`
 * anticipates -- used by the admin cabin form (create's required cover image, edit's gallery
 * management) rather than the seed script.
 */
export async function adminGenerateUploadUrl(ctx: MutationCtx) {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
}

export async function adminSetCoverImage(
    ctx: MutationCtx,
    args: { cabinId: Id<'cabins'>; storageId: Id<'_storage'> },
) {
    await requireAdmin(ctx);

    const cabin = await ctx.db.get(args.cabinId);
    if (!cabin) throw new ConvexError('Unknown cabin.');

    await ctx.db.patch(args.cabinId, { coverImage: args.storageId, updatedAt: Date.now() });
}

/**
 * Replaces the whole gallery array (WO-049) -- add/remove/reorder are all just "here's the
 * new full ordered list" from the client's point of view, so one mutation covers all three
 * instead of three narrower ones.
 */
export async function adminSetGalleryImages(
    ctx: MutationCtx,
    args: { cabinId: Id<'cabins'>; storageIds: Id<'_storage'>[] },
) {
    await requireAdmin(ctx);

    const cabin = await ctx.db.get(args.cabinId);
    if (!cabin) throw new ConvexError('Unknown cabin.');

    await ctx.db.patch(args.cabinId, { galleryImages: args.storageIds, updatedAt: Date.now() });
}

/**
 * Dev/seed-only, same reasoning as `cabins.ts`'s `generateUploadUrl`. Lets
 * `scripts/seed-cabins.ts` re-run against an already-seeded cabin (e.g. to
 * update `featured`) without re-uploading its images or exposing the raw
 * `_storage` id through any public query.
 */
export async function getStorageIdsBySlug(ctx: QueryCtx, args: { slug: string }) {
    const cabin = await ctx.db
        .query('cabins')
        .withIndex('by_slug', (q) => q.eq('slug', args.slug))
        .unique();

    if (!cabin) return null;

    return { coverImage: cabin.coverImage, galleryImages: cabin.galleryImages };
}

type SeedCabinInput = {
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    location: string;
    nightlyRate: number;
    cleaningFee: number;
    maxGuests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    coverImage: Id<'_storage'>;
    galleryImages: Id<'_storage'>[];
    /** Names, not ids -- resolved against the amenities table below. */
    amenityNames: string[];
    published: boolean;
    featured: boolean;
    createdAt: number;
    updatedAt: number;
};

/**
 * Upsert by slug (convex-seed skill: "make seeding idempotent" via
 * clear-then-insert or upsert). An existing cabin's `coverImage` and
 * `galleryImages` are always kept as-is -- the input's image fields matter
 * only for a brand-new cabin -- so every other field, including `featured`,
 * stays in sync on a re-run.
 */
export async function seedCabins(ctx: MutationCtx, args: { cabins: SeedCabinInput[] }) {
    const ids = [];

    for (const input of args.cabins) {
        assertIntegerCents(input.nightlyRate, 'nightlyRate');
        assertIntegerCents(input.cleaningFee, 'cleaningFee');

        const existing = await ctx.db
            .query('cabins')
            .withIndex('by_slug', (q) => q.eq('slug', input.slug))
            .unique();

        const amenityIds = await Promise.all(
            input.amenityNames.map(async (name) => {
                const amenity = await ctx.db
                    .query('amenities')
                    .withIndex('by_name', (q) => q.eq('name', name))
                    .unique();

                if (!amenity) {
                    throw new ConvexError(
                        `Unknown amenity "${name}" -- run seedAmenities before seedCabins.`,
                    );
                }

                return amenity._id;
            }),
        );

        const fields = {
            name: input.name,
            slug: input.slug,
            shortDescription: input.shortDescription,
            description: input.description,
            location: input.location,
            nightlyRate: input.nightlyRate,
            cleaningFee: input.cleaningFee,
            maxGuests: input.maxGuests,
            bedrooms: input.bedrooms,
            beds: input.beds,
            bathrooms: input.bathrooms,
            published: input.published,
            featured: input.featured,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt,
            amenities: amenityIds,
        };

        if (existing) {
            await ctx.db.patch(existing._id, fields);
            ids.push(existing._id);
            continue;
        }

        ids.push(
            await ctx.db.insert('cabins', {
                ...fields,
                coverImage: input.coverImage,
                galleryImages: input.galleryImages,
            }),
        );
    }

    return ids;
}
