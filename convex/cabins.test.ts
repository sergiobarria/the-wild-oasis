import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import { api, internal } from './_generated/api';
import type { Id } from './_generated/dataModel';
import authComponentSchema from './betterAuth/schema';
import schema from './schema';

const modules = import.meta.glob('./**/*.ts');
const authComponentModules = import.meta.glob('./betterAuth/**/*.ts');

function setupTestWithAuth() {
    const t = convexTest(schema, modules);
    t.registerComponent('betterAuth', authComponentSchema, authComponentModules);
    return t;
}

async function seedAdmin(t: ReturnType<typeof setupTestWithAuth>) {
    return await t.mutation(internal.testHelpers.seedAuthenticatedUser, {
        email: 'admin@example.com',
        password: 'password123',
        name: 'Admin User',
        role: 'admin',
    });
}

async function seedGuest(t: ReturnType<typeof setupTestWithAuth>) {
    return await t.mutation(internal.testHelpers.seedAuthenticatedUser, {
        email: 'guest@example.com',
        password: 'password123',
        name: 'Guest User',
    });
}

async function seedImage(t: ReturnType<typeof convexTest>) {
    return await t.run((ctx) =>
        ctx.storage.store(new Blob(['fake-image'], { type: 'image/jpeg' })),
    );
}

function adminCabinArgs(
    overrides: { coverImage: Id<'_storage'>; slug?: string } & Partial<{
        name: string;
        shortDescription: string;
        description: string;
        location: string;
        nightlyRate: number;
        cleaningFee: number;
        maxGuests: number;
        bedrooms: number;
        beds: number;
        bathrooms: number;
        amenityIds: Id<'amenities'>[];
        published: boolean;
        featured: boolean;
    }>,
) {
    return {
        name: overrides.name ?? 'Pine Ridge Cabin',
        slug: overrides.slug ?? 'pine-ridge-cabin',
        shortDescription: overrides.shortDescription ?? 'A quiet cabin in the woods.',
        description: overrides.description ?? 'A longer description of a quiet cabin.',
        location: overrides.location ?? 'Pine Ridge',
        nightlyRate: overrides.nightlyRate ?? 25000,
        cleaningFee: overrides.cleaningFee ?? 3500,
        maxGuests: overrides.maxGuests ?? 4,
        bedrooms: overrides.bedrooms ?? 2,
        beds: overrides.beds ?? 3,
        bathrooms: overrides.bathrooms ?? 1,
        amenityIds: overrides.amenityIds ?? [],
        published: overrides.published ?? true,
        featured: overrides.featured ?? false,
        coverImage: overrides.coverImage,
    };
}

function cabinInput(overrides: {
    slug?: string;
    coverImage: Id<'_storage'>;
    galleryImages?: Id<'_storage'>[];
    amenityNames?: string[];
    published?: boolean;
    featured?: boolean;
    name?: string;
    maxGuests?: number;
    nightlyRate?: number;
}) {
    const now = 1700000000000;

    return {
        name: overrides.name ?? 'Pine Ridge Cabin',
        slug: overrides.slug ?? 'pine-ridge-cabin',
        shortDescription: 'A quiet cabin in the woods.',
        description: 'A longer description of a quiet cabin in the woods.',
        location: 'Pine Ridge',
        nightlyRate: overrides.nightlyRate ?? 25000,
        cleaningFee: 3500,
        maxGuests: overrides.maxGuests ?? 4,
        bedrooms: 2,
        beds: 3,
        bathrooms: 1,
        coverImage: overrides.coverImage,
        galleryImages: overrides.galleryImages ?? [overrides.coverImage],
        amenityNames: overrides.amenityNames ?? ['WiFi'],
        published: overrides.published ?? true,
        featured: overrides.featured ?? false,
        createdAt: now,
        updatedAt: now,
    };
}

describe('getBySlug', () => {
    test('returns null for an unknown slug', async () => {
        const t = convexTest(schema, modules);

        expect(await t.query(api.cabins.getBySlug, { slug: 'does-not-exist' })).toBeNull();
    });

    test('returns null for an unpublished cabin', async () => {
        const t = convexTest(schema, modules);
        const coverImage = await seedImage(t);

        await t.run((ctx) =>
            ctx.db.insert('cabins', {
                name: 'Draft Cabin',
                slug: 'draft-cabin',
                shortDescription: 'Not yet published.',
                description: 'Not yet published.',
                location: 'Nowhere',
                nightlyRate: 10000,
                cleaningFee: 2000,
                maxGuests: 2,
                bedrooms: 1,
                beds: 1,
                bathrooms: 1,
                coverImage,
                galleryImages: [coverImage],
                amenities: [],
                published: false,
                featured: false,
                createdAt: 1700000000000,
                updatedAt: 1700000000000,
            }),
        );

        expect(await t.query(api.cabins.getBySlug, { slug: 'draft-cabin' })).toBeNull();
    });

    test('returns a fully resolved cabin for a published slug', async () => {
        const t = convexTest(schema, modules);
        await t.mutation(internal.amenities.seedAmenities, {});
        const coverImage = await seedImage(t);

        await t.mutation(internal.cabins.seedCabins, {
            cabins: [
                cabinInput({
                    slug: 'pine-ridge-cabin',
                    coverImage,
                    amenityNames: ['WiFi', 'Hot Tub'],
                }),
            ],
        });

        const cabin = await t.query(api.cabins.getBySlug, { slug: 'pine-ridge-cabin' });

        expect(cabin).toMatchObject({
            slug: 'pine-ridge-cabin',
            name: 'Pine Ridge Cabin',
            published: true,
        });
        expect(cabin?.coverImageUrl).toEqual(expect.any(String));
        expect(cabin?.galleryImageUrls).toHaveLength(1);
        expect(cabin?.amenities.map((a) => a.name).sort()).toEqual(['Hot Tub', 'WiFi']);
        expect(cabin).toMatchObject({ reviews: [], averageRating: null, reviewCount: 0 });
    });

    test('includes seeded reviews with a computed average rating', async () => {
        const t = convexTest(schema, modules);
        await t.mutation(internal.amenities.seedAmenities, {});
        const coverImage = await seedImage(t);

        await t.mutation(internal.cabins.seedCabins, {
            cabins: [cabinInput({ slug: 'reviewed-cabin', coverImage })],
        });
        const seededCabin = await t.query(api.cabins.getBySlug, { slug: 'reviewed-cabin' });

        await t.mutation(internal.reviews.seedReviews, {
            cabinId: seededCabin!._id,
            reviews: [
                {
                    userId: 'seed-guest-1',
                    authorName: 'Sarah Mitchell',
                    rating: 5,
                    comment: 'Wonderful stay.',
                    createdAt: 1700000000000,
                },
                {
                    userId: 'seed-guest-2',
                    authorName: 'Marco Rossi',
                    rating: 3,
                    comment: 'It was fine.',
                    createdAt: 1700000001000,
                },
            ],
        });

        const cabin = await t.query(api.cabins.getBySlug, { slug: 'reviewed-cabin' });

        expect(cabin?.reviewCount).toBe(2);
        expect(cabin?.averageRating).toBe(4);
        expect(cabin?.reviews.map((r) => r.authorName)).toEqual(['Marco Rossi', 'Sarah Mitchell']);
    });
});

describe('getById', () => {
    test('returns null for an unknown cabin id', async () => {
        const t = convexTest(schema, modules);
        const coverImage = await seedImage(t);
        await t.mutation(internal.amenities.seedAmenities, {});
        await t.mutation(internal.cabins.seedCabins, { cabins: [cabinInput({ coverImage })] });

        const cabin = await t.query(api.cabins.getBySlug, { slug: 'pine-ridge-cabin' });
        await t.run((ctx) => ctx.db.delete(cabin!._id));

        expect(await t.query(api.cabins.getById, { cabinId: cabin!._id })).toBeNull();
    });

    test('returns null for an unpublished cabin', async () => {
        const t = convexTest(schema, modules);
        const coverImage = await seedImage(t);
        await t.mutation(internal.amenities.seedAmenities, {});
        await t.mutation(internal.cabins.seedCabins, {
            cabins: [cabinInput({ coverImage, published: false })],
        });

        const cabinId = await t.run((ctx) =>
            ctx.db
                .query('cabins')
                .withIndex('by_slug', (q) => q.eq('slug', 'pine-ridge-cabin'))
                .unique()
                .then((c) => c!._id),
        );

        expect(await t.query(api.cabins.getById, { cabinId })).toBeNull();
    });

    test('returns a summary card for a published cabin', async () => {
        const t = convexTest(schema, modules);
        const coverImage = await seedImage(t);
        await t.mutation(internal.amenities.seedAmenities, {});
        await t.mutation(internal.cabins.seedCabins, { cabins: [cabinInput({ coverImage })] });

        const bySlug = await t.query(api.cabins.getBySlug, { slug: 'pine-ridge-cabin' });
        const cabin = await t.query(api.cabins.getById, { cabinId: bySlug!._id });

        expect(cabin).toMatchObject({
            name: 'Pine Ridge Cabin',
            slug: 'pine-ridge-cabin',
            location: 'Pine Ridge',
            nightlyRate: 25000,
            cleaningFee: 3500,
            maxGuests: 4,
        });
        expect(cabin?.coverImageUrl).toEqual(expect.any(String));
    });
});

describe('listPublished', () => {
    test('excludes unpublished cabins and includes published ones', async () => {
        const t = convexTest(schema, modules);
        await t.mutation(internal.amenities.seedAmenities, {});
        const coverImage = await seedImage(t);

        await t.mutation(internal.cabins.seedCabins, {
            cabins: [
                cabinInput({ slug: 'published-cabin', coverImage, published: true }),
                cabinInput({ slug: 'unpublished-cabin', coverImage, published: false }),
            ],
        });

        const result = await t.query(api.cabins.listPublished, {
            paginationOpts: { numItems: 10, cursor: null },
        });

        expect(result.page.map((c) => c.slug)).toEqual(['published-cabin']);
    });

    test('narrows to featured cabins when featuredOnly is set', async () => {
        const t = convexTest(schema, modules);
        await t.mutation(internal.amenities.seedAmenities, {});
        const coverImage = await seedImage(t);

        await t.mutation(internal.cabins.seedCabins, {
            cabins: [
                cabinInput({ slug: 'featured-cabin', coverImage, featured: true }),
                cabinInput({ slug: 'regular-cabin', coverImage, featured: false }),
            ],
        });

        const result = await t.query(api.cabins.listPublished, {
            paginationOpts: { numItems: 10, cursor: null },
            featuredOnly: true,
        });

        expect(result.page.map((c) => c.slug)).toEqual(['featured-cabin']);
    });
});

describe('listFiltered', () => {
    test('returns every published cabin when no filters are given', async () => {
        const t = convexTest(schema, modules);
        await t.mutation(internal.amenities.seedAmenities, {});
        const coverImage = await seedImage(t);

        await t.mutation(internal.cabins.seedCabins, {
            cabins: [
                cabinInput({ slug: 'published-cabin', coverImage, published: true }),
                cabinInput({ slug: 'unpublished-cabin', coverImage, published: false }),
            ],
        });

        const result = await t.query(api.cabins.listFiltered, {});

        expect(result.map((c) => c.slug)).toEqual(['published-cabin']);
    });

    test('narrows by name -- case-insensitive substring match', async () => {
        const t = convexTest(schema, modules);
        await t.mutation(internal.amenities.seedAmenities, {});
        const coverImage = await seedImage(t);

        await t.mutation(internal.cabins.seedCabins, {
            cabins: [
                cabinInput({ slug: 'lakeside-lodge', coverImage, name: 'Lakeside Lodge' }),
                cabinInput({ slug: 'mountain-cabin', coverImage, name: 'Mountain Cabin' }),
            ],
        });

        const result = await t.query(api.cabins.listFiltered, { name: 'lake' });

        expect(result.map((c) => c.slug)).toEqual(['lakeside-lodge']);
    });

    test('narrows by guests -- cabin capacity must be at least the requested guests', async () => {
        const t = convexTest(schema, modules);
        await t.mutation(internal.amenities.seedAmenities, {});
        const coverImage = await seedImage(t);

        await t.mutation(internal.cabins.seedCabins, {
            cabins: [
                cabinInput({ slug: 'small-cabin', coverImage, maxGuests: 2 }),
                cabinInput({ slug: 'large-cabin', coverImage, maxGuests: 8 }),
            ],
        });

        const result = await t.query(api.cabins.listFiltered, { guests: 4 });

        expect(result.map((c) => c.slug)).toEqual(['large-cabin']);
    });

    test('narrows by max price -- nightly rate must be at most the ceiling', async () => {
        const t = convexTest(schema, modules);
        await t.mutation(internal.amenities.seedAmenities, {});
        const coverImage = await seedImage(t);

        await t.mutation(internal.cabins.seedCabins, {
            cabins: [
                cabinInput({ slug: 'cheap-cabin', coverImage, nightlyRate: 10000 }),
                cabinInput({ slug: 'pricey-cabin', coverImage, nightlyRate: 50000 }),
            ],
        });

        const result = await t.query(api.cabins.listFiltered, { maxPriceCents: 20000 });

        expect(result.map((c) => c.slug)).toEqual(['cheap-cabin']);
    });

    test('narrows by amenities -- cabin must have ALL selected amenities, not just one', async () => {
        const t = convexTest(schema, modules);
        await t.mutation(internal.amenities.seedAmenities, {});
        const coverImage = await seedImage(t);
        const wifi = await t.run((ctx) =>
            ctx.db
                .query('amenities')
                .withIndex('by_name', (q) => q.eq('name', 'WiFi'))
                .unique(),
        );
        const hotTub = await t.run((ctx) =>
            ctx.db
                .query('amenities')
                .withIndex('by_name', (q) => q.eq('name', 'Hot Tub'))
                .unique(),
        );

        await t.mutation(internal.cabins.seedCabins, {
            cabins: [
                cabinInput({
                    slug: 'has-both',
                    coverImage,
                    amenityNames: ['WiFi', 'Hot Tub'],
                }),
                cabinInput({ slug: 'has-only-wifi', coverImage, amenityNames: ['WiFi'] }),
            ],
        });

        const result = await t.query(api.cabins.listFiltered, {
            amenityIds: [wifi!._id, hotTub!._id],
        });

        expect(result.map((c) => c.slug)).toEqual(['has-both']);
        expect(result[0]?.amenities.map((a) => a.name).sort()).toEqual(['Hot Tub', 'WiFi']);
    });

    test('combines guests, max price, and amenities filters', async () => {
        const t = convexTest(schema, modules);
        await t.mutation(internal.amenities.seedAmenities, {});
        const coverImage = await seedImage(t);
        const wifi = await t.run((ctx) =>
            ctx.db
                .query('amenities')
                .withIndex('by_name', (q) => q.eq('name', 'WiFi'))
                .unique(),
        );

        await t.mutation(internal.cabins.seedCabins, {
            cabins: [
                cabinInput({
                    slug: 'matches-all',
                    coverImage,
                    maxGuests: 6,
                    nightlyRate: 15000,
                    amenityNames: ['WiFi'],
                }),
                cabinInput({
                    slug: 'too-expensive',
                    coverImage,
                    maxGuests: 6,
                    nightlyRate: 40000,
                    amenityNames: ['WiFi'],
                }),
                cabinInput({
                    slug: 'too-small',
                    coverImage,
                    maxGuests: 2,
                    nightlyRate: 15000,
                    amenityNames: ['WiFi'],
                }),
            ],
        });

        const result = await t.query(api.cabins.listFiltered, {
            guests: 4,
            maxPriceCents: 20000,
            amenityIds: [wifi!._id],
        });

        expect(result.map((c) => c.slug)).toEqual(['matches-all']);
    });
});

describe('getStorageIdsBySlug', () => {
    test('returns null for an unknown slug', async () => {
        const t = convexTest(schema, modules);

        expect(
            await t.query(internal.cabins.getStorageIdsBySlug, { slug: 'does-not-exist' }),
        ).toBeNull();
    });

    test('returns the stored image ids for a known slug', async () => {
        const t = convexTest(schema, modules);
        await t.mutation(internal.amenities.seedAmenities, {});
        const coverImage = await seedImage(t);

        await t.mutation(internal.cabins.seedCabins, {
            cabins: [cabinInput({ slug: 'imaged-cabin', coverImage })],
        });

        expect(
            await t.query(internal.cabins.getStorageIdsBySlug, { slug: 'imaged-cabin' }),
        ).toEqual({ coverImage, galleryImages: [coverImage] });
    });
});

describe('generateUploadUrl', () => {
    test('returns a signed upload URL', async () => {
        const t = convexTest(schema, modules);

        const uploadUrl = await t.mutation(internal.cabins.generateUploadUrl, {});

        expect(uploadUrl).toEqual(expect.any(String));
    });
});

describe('seedCabins', () => {
    test('is idempotent by slug', async () => {
        const t = convexTest(schema, modules);
        await t.mutation(internal.amenities.seedAmenities, {});
        const coverImage = await seedImage(t);

        await t.mutation(internal.cabins.seedCabins, {
            cabins: [cabinInput({ slug: 'repeat-cabin', coverImage })],
        });
        await t.mutation(internal.cabins.seedCabins, {
            cabins: [cabinInput({ slug: 'repeat-cabin', coverImage })],
        });

        const result = await t.query(api.cabins.listPublished, {
            paginationOpts: { numItems: 10, cursor: null },
        });
        expect(result.page.filter((c) => c.slug === 'repeat-cabin')).toHaveLength(1);
    });

    test('upserts by slug -- a re-run updates fields but keeps the original images', async () => {
        const t = convexTest(schema, modules);
        await t.mutation(internal.amenities.seedAmenities, {});
        const originalImage = await seedImage(t);
        const unusedImage = await seedImage(t);

        await t.mutation(internal.cabins.seedCabins, {
            cabins: [
                cabinInput({
                    slug: 'synced-cabin',
                    coverImage: originalImage,
                    featured: false,
                }),
            ],
        });
        await t.mutation(internal.cabins.seedCabins, {
            cabins: [
                cabinInput({
                    slug: 'synced-cabin',
                    coverImage: unusedImage,
                    featured: true,
                    name: 'Renamed Cabin',
                }),
            ],
        });

        const cabin = await t.run((ctx) =>
            ctx.db
                .query('cabins')
                .withIndex('by_slug', (q) => q.eq('slug', 'synced-cabin'))
                .unique(),
        );
        expect(cabin).toMatchObject({
            name: 'Renamed Cabin',
            featured: true,
            coverImage: originalImage,
        });
    });

    test('throws when an amenity name has not been seeded yet', async () => {
        const t = convexTest(schema, modules);
        const coverImage = await seedImage(t);

        await expect(
            t.mutation(internal.cabins.seedCabins, {
                cabins: [
                    cabinInput({ slug: 'orphan-cabin', coverImage, amenityNames: ['Nonexistent'] }),
                ],
            }),
        ).rejects.toThrow();
    });
});

describe('adminCreateCabin', () => {
    test('throws for a non-admin caller', async () => {
        const t = setupTestWithAuth();
        const coverImage = await seedImage(t);
        const guest = await seedGuest(t);

        await expect(
            t
                .withIdentity(guest)
                .mutation(api.cabins.adminCreateCabin, adminCabinArgs({ coverImage })),
        ).rejects.toThrow();
    });

    test('creates an unpublished-by-default-allowed cabin with the given fields', async () => {
        const t = setupTestWithAuth();
        const coverImage = await seedImage(t);
        const admin = await seedAdmin(t);

        const cabinId = await t
            .withIdentity(admin)
            .mutation(
                api.cabins.adminCreateCabin,
                adminCabinArgs({ coverImage, published: false }),
            );

        const cabin = await t.run((ctx) => ctx.db.get(cabinId));
        expect(cabin).toMatchObject({
            name: 'Pine Ridge Cabin',
            slug: 'pine-ridge-cabin',
            published: false,
            galleryImages: [],
        });
    });

    test('rejects a duplicate slug', async () => {
        const t = setupTestWithAuth();
        const coverImage = await seedImage(t);
        const admin = await seedAdmin(t);
        await t
            .withIdentity(admin)
            .mutation(api.cabins.adminCreateCabin, adminCabinArgs({ coverImage }));

        await expect(
            t
                .withIdentity(admin)
                .mutation(api.cabins.adminCreateCabin, adminCabinArgs({ coverImage })),
        ).rejects.toThrow('A cabin with the slug "pine-ridge-cabin" already exists.');
    });
});

describe('adminUpdateCabin', () => {
    test('throws for a non-admin caller', async () => {
        const t = setupTestWithAuth();
        const coverImage = await seedImage(t);
        const admin = await seedAdmin(t);
        const guest = await seedGuest(t);
        const cabinId = await t
            .withIdentity(admin)
            .mutation(api.cabins.adminCreateCabin, adminCabinArgs({ coverImage }));

        await expect(
            t
                .withIdentity(guest)
                .mutation(api.cabins.adminUpdateCabin, { cabinId, name: 'New Name' }),
        ).rejects.toThrow();
    });

    test('patches only the given fields', async () => {
        const t = setupTestWithAuth();
        const coverImage = await seedImage(t);
        const admin = await seedAdmin(t);
        const cabinId = await t
            .withIdentity(admin)
            .mutation(api.cabins.adminCreateCabin, adminCabinArgs({ coverImage }));

        await t
            .withIdentity(admin)
            .mutation(api.cabins.adminUpdateCabin, { cabinId, name: 'Renamed Cabin' });

        const cabin = await t.run((ctx) => ctx.db.get(cabinId));
        expect(cabin).toMatchObject({ name: 'Renamed Cabin', slug: 'pine-ridge-cabin' });
    });

    test('allows re-saving the same slug on the same cabin', async () => {
        const t = setupTestWithAuth();
        const coverImage = await seedImage(t);
        const admin = await seedAdmin(t);
        const cabinId = await t
            .withIdentity(admin)
            .mutation(api.cabins.adminCreateCabin, adminCabinArgs({ coverImage }));

        await expect(
            t.withIdentity(admin).mutation(api.cabins.adminUpdateCabin, {
                cabinId,
                slug: 'pine-ridge-cabin',
            }),
        ).resolves.not.toThrow();
    });

    test('rejects renaming the slug to one already used by another cabin', async () => {
        const t = setupTestWithAuth();
        const coverImage = await seedImage(t);
        const admin = await seedAdmin(t);
        await t
            .withIdentity(admin)
            .mutation(api.cabins.adminCreateCabin, adminCabinArgs({ coverImage, slug: 'taken' }));
        const cabinId = await t
            .withIdentity(admin)
            .mutation(
                api.cabins.adminCreateCabin,
                adminCabinArgs({ coverImage, slug: 'other-cabin' }),
            );

        await expect(
            t.withIdentity(admin).mutation(api.cabins.adminUpdateCabin, { cabinId, slug: 'taken' }),
        ).rejects.toThrow('A cabin with the slug "taken" already exists.');
    });
});

describe('adminSetPublished', () => {
    test('throws for a non-admin caller', async () => {
        const t = setupTestWithAuth();
        const coverImage = await seedImage(t);
        const admin = await seedAdmin(t);
        const guest = await seedGuest(t);
        const cabinId = await t
            .withIdentity(admin)
            .mutation(
                api.cabins.adminCreateCabin,
                adminCabinArgs({ coverImage, published: false }),
            );

        await expect(
            t
                .withIdentity(guest)
                .mutation(api.cabins.adminSetPublished, { cabinId, published: true }),
        ).rejects.toThrow();
    });

    test('toggles published without touching other fields', async () => {
        const t = setupTestWithAuth();
        const coverImage = await seedImage(t);
        const admin = await seedAdmin(t);
        const cabinId = await t
            .withIdentity(admin)
            .mutation(
                api.cabins.adminCreateCabin,
                adminCabinArgs({ coverImage, published: false }),
            );

        await t
            .withIdentity(admin)
            .mutation(api.cabins.adminSetPublished, { cabinId, published: true });

        const cabin = await t.run((ctx) => ctx.db.get(cabinId));
        expect(cabin).toMatchObject({ published: true, name: 'Pine Ridge Cabin' });
    });
});

describe('adminListCabins', () => {
    test('throws for a non-admin caller', async () => {
        const t = setupTestWithAuth();
        const guest = await seedGuest(t);

        await expect(
            t.withIdentity(guest).query(api.cabins.adminListCabins, {
                paginationOpts: { numItems: 10, cursor: null },
            }),
        ).rejects.toThrow();
    });

    test('includes unpublished cabins, unlike listPublished', async () => {
        const t = setupTestWithAuth();
        const coverImage = await seedImage(t);
        const admin = await seedAdmin(t);
        await t
            .withIdentity(admin)
            .mutation(
                api.cabins.adminCreateCabin,
                adminCabinArgs({ coverImage, published: false }),
            );

        const result = await t.withIdentity(admin).query(api.cabins.adminListCabins, {
            paginationOpts: { numItems: 10, cursor: null },
        });

        expect(result.page).toHaveLength(1);
        expect(result.page[0]).toMatchObject({ published: false });
    });
});

describe('adminGetCabin', () => {
    test('throws for a non-admin caller', async () => {
        const t = setupTestWithAuth();
        const coverImage = await seedImage(t);
        const admin = await seedAdmin(t);
        const guest = await seedGuest(t);
        const cabinId = await t
            .withIdentity(admin)
            .mutation(api.cabins.adminCreateCabin, adminCabinArgs({ coverImage }));

        await expect(
            t.withIdentity(guest).query(api.cabins.adminGetCabin, { cabinId }),
        ).rejects.toThrow();
    });

    test('returns null for an unknown cabin', async () => {
        const t = setupTestWithAuth();
        const admin = await seedAdmin(t);
        const coverImage = await seedImage(t);
        const cabinId = await t
            .withIdentity(admin)
            .mutation(api.cabins.adminCreateCabin, adminCabinArgs({ coverImage }));
        await t.run((ctx) => ctx.db.delete(cabinId));

        expect(await t.withIdentity(admin).query(api.cabins.adminGetCabin, { cabinId })).toBeNull();
    });

    test('returns the full record, including unpublished cabins and raw amenity ids', async () => {
        const t = setupTestWithAuth();
        await t.mutation(internal.amenities.seedAmenities, {});
        const amenities = await t.query(api.amenities.list);
        const wifi = amenities.find((amenity) => amenity.name === 'WiFi');
        const coverImage = await seedImage(t);
        const admin = await seedAdmin(t);
        const cabinId = await t.withIdentity(admin).mutation(
            api.cabins.adminCreateCabin,
            adminCabinArgs({
                coverImage,
                published: false,
                amenityIds: wifi ? [wifi._id] : [],
            }),
        );

        const cabin = await t.withIdentity(admin).query(api.cabins.adminGetCabin, { cabinId });

        expect(cabin).toMatchObject({ published: false, amenityIds: wifi ? [wifi._id] : [] });
    });
});
