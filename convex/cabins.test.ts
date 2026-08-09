import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import { api, internal } from './_generated/api';
import type { Id } from './_generated/dataModel';
import schema from './schema';

const modules = import.meta.glob('./**/*.ts');

async function seedImage(t: ReturnType<typeof convexTest>) {
    return await t.run((ctx) =>
        ctx.storage.store(new Blob(['fake-image'], { type: 'image/jpeg' })),
    );
}

function cabinInput(overrides: {
    slug?: string;
    coverImage: Id<'_storage'>;
    galleryImages?: Id<'_storage'>[];
    amenityNames?: string[];
    published?: boolean;
}) {
    const now = 1700000000000;

    return {
        name: 'Pine Ridge Cabin',
        slug: overrides.slug ?? 'pine-ridge-cabin',
        shortDescription: 'A quiet cabin in the woods.',
        description: 'A longer description of a quiet cabin in the woods.',
        location: 'Pine Ridge',
        nightlyRate: 25000,
        cleaningFee: 3500,
        maxGuests: 4,
        bedrooms: 2,
        beds: 3,
        bathrooms: 1,
        coverImage: overrides.coverImage,
        galleryImages: overrides.galleryImages ?? [overrides.coverImage],
        amenityNames: overrides.amenityNames ?? ['WiFi'],
        published: overrides.published ?? true,
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
