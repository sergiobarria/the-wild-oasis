import { paginationOptsValidator, paginationResultValidator } from 'convex/server';
import { ConvexError, v } from 'convex/values';

import type { Id } from './_generated/dataModel';
import { internalMutation, internalQuery, query, type QueryCtx } from './_generated/server';
import { amenityCategoryValidator } from './lib/amenities';
import { assertIntegerCents } from './lib/money';

const cabinCardValidator = v.object({
    _id: v.id('cabins'),
    _creationTime: v.number(),
    name: v.string(),
    slug: v.string(),
    shortDescription: v.string(),
    location: v.string(),
    nightlyRate: v.number(),
    cleaningFee: v.number(),
    maxGuests: v.number(),
    bedrooms: v.number(),
    beds: v.number(),
    bathrooms: v.number(),
    coverImageUrl: v.union(v.string(), v.null()),
    published: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
});

/** Shared by `getBySlug` and `listFiltered` -- resolves amenity ids to their display shape. */
async function resolveAmenities(ctx: QueryCtx, amenityIds: Id<'amenities'>[]) {
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
 * Cover-image cards for spec §26/§27's listing page. Signed URLs only -- the
 * raw `_storage` id never leaves this query. `featuredOnly` narrows to the
 * admin-curated set for the home page's Featured Cabins section (spec §24) --
 * omit it for the full `/cabins` listing.
 */
export const listPublished = query({
    args: { paginationOpts: paginationOptsValidator, featuredOnly: v.optional(v.boolean()) },
    returns: paginationResultValidator(cabinCardValidator),
    handler: async (ctx, args) => {
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
    },
});

const cabinListingCardValidator = cabinCardValidator.extend({
    amenities: v.array(
        v.object({
            _id: v.id('amenities'),
            name: v.string(),
            icon: v.string(),
            category: amenityCategoryValidator,
        }),
    ),
});

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
export const listFiltered = query({
    args: {
        name: v.optional(v.string()),
        guests: v.optional(v.number()),
        maxPriceCents: v.optional(v.number()),
        amenityIds: v.optional(v.array(v.id('amenities'))),
    },
    returns: v.array(cabinListingCardValidator),
    handler: async (ctx, args) => {
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
            const matchesName =
                !normalizedName || cabin.name.toLowerCase().includes(normalizedName);
            const matchesAmenities =
                !args.amenityIds?.length ||
                args.amenityIds.every((id) => cabin.amenities.includes(id));

            return matchesName && matchesAmenities;
        });

        return await Promise.all(
            matching.map(async (cabin) => {
                const [coverImageUrl, amenities] = await Promise.all([
                    ctx.storage.getUrl(cabin.coverImage),
                    resolveAmenities(ctx, cabin.amenities),
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
    },
});

const cabinDetailValidator = v.object({
    _id: v.id('cabins'),
    _creationTime: v.number(),
    name: v.string(),
    slug: v.string(),
    shortDescription: v.string(),
    description: v.string(),
    location: v.string(),
    nightlyRate: v.number(),
    cleaningFee: v.number(),
    maxGuests: v.number(),
    bedrooms: v.number(),
    beds: v.number(),
    bathrooms: v.number(),
    coverImageUrl: v.union(v.string(), v.null()),
    galleryImageUrls: v.array(v.string()),
    amenities: v.array(
        v.object({
            _id: v.id('amenities'),
            name: v.string(),
            icon: v.string(),
            category: amenityCategoryValidator,
        }),
    ),
    published: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
});

/**
 * Single cabin by slug, for spec §28's detail page. Returns `null` for an
 * unknown slug OR an unpublished one -- this is an unauthenticated public
 * query, so a draft cabin must never leak here.
 */
export const getBySlug = query({
    args: { slug: v.string() },
    returns: v.union(cabinDetailValidator, v.null()),
    handler: async (ctx, args) => {
        const cabin = await ctx.db
            .query('cabins')
            .withIndex('by_slug', (q) => q.eq('slug', args.slug))
            .unique();

        if (!cabin || !cabin.published) return null;

        const [coverImageUrl, galleryImageUrls, amenities] = await Promise.all([
            ctx.storage.getUrl(cabin.coverImage),
            Promise.all(cabin.galleryImages.map((id) => ctx.storage.getUrl(id))),
            resolveAmenities(ctx, cabin.amenities),
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
        };
    },
});

/**
 * Dev/seed-only. NOT admin-gated: there is no authenticated caller when
 * seeding a fresh deployment. A future admin image-upload ticket must add a
 * separate PUBLIC, `requireAdmin`-gated version for the real admin UI -- this
 * one stays internal, only ever invoked from `scripts/seed-cabins.ts` or tests.
 */
export const generateUploadUrl = internalMutation({
    args: {},
    returns: v.string(),
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl();
    },
});

/**
 * Dev/seed-only, same reasoning as `generateUploadUrl` above. Lets
 * `scripts/seed-cabins.ts` re-run against an already-seeded cabin (e.g. to
 * update `featured`) without re-uploading its images or exposing the raw
 * `_storage` id through any public query.
 */
export const getStorageIdsBySlug = internalQuery({
    args: { slug: v.string() },
    returns: v.union(
        v.object({ coverImage: v.id('_storage'), galleryImages: v.array(v.id('_storage')) }),
        v.null(),
    ),
    handler: async (ctx, args) => {
        const cabin = await ctx.db
            .query('cabins')
            .withIndex('by_slug', (q) => q.eq('slug', args.slug))
            .unique();

        if (!cabin) return null;

        return { coverImage: cabin.coverImage, galleryImages: cabin.galleryImages };
    },
});

const seedCabinValidator = v.object({
    name: v.string(),
    slug: v.string(),
    shortDescription: v.string(),
    description: v.string(),
    location: v.string(),
    nightlyRate: v.number(),
    cleaningFee: v.number(),
    maxGuests: v.number(),
    bedrooms: v.number(),
    beds: v.number(),
    bathrooms: v.number(),
    coverImage: v.id('_storage'),
    galleryImages: v.array(v.id('_storage')),
    /** Names, not ids -- resolved against the amenities table below. */
    amenityNames: v.array(v.string()),
    published: v.boolean(),
    featured: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
});

/**
 * Upsert by slug (convex-seed skill: "make seeding idempotent" via
 * clear-then-insert or upsert). An existing cabin's `coverImage` and
 * `galleryImages` are always kept as-is -- the input's image fields matter
 * only for a brand-new cabin -- so every other field, including `featured`,
 * stays in sync on a re-run.
 */
export const seedCabins = internalMutation({
    args: { cabins: v.array(seedCabinValidator) },
    returns: v.array(v.id('cabins')),
    handler: async (ctx, args) => {
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
    },
});
