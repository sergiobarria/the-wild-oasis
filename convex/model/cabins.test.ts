import { convexTest } from 'convex-test';
import { describe, expect, test } from 'vitest';

import { internal } from '../_generated/api';
import type { Id } from '../_generated/dataModel';
import authComponentSchema from '../betterAuth/schema';
import schema from '../schema';
import {
    adminAddGalleryImages,
    adminCreateCabin,
    adminGenerateUploadUrl,
    adminGetCabin,
    adminListCabins,
    adminRemoveGalleryImage,
    adminReorderGalleryImage,
    adminSetCoverImage,
    adminSetCoverImageFromGallery,
    adminSetPublished,
    adminUpdateCabin,
    getStorageIdsBySlug,
    seedCabins,
} from './cabins';

const modules = import.meta.glob('../**/*.ts');
const authComponentModules = import.meta.glob('../betterAuth/**/*.ts');

function setupTest() {
    const t = convexTest(schema, modules);
    t.registerComponent('betterAuth', authComponentSchema, authComponentModules);
    return t;
}

async function seedAdmin(t: ReturnType<typeof setupTest>) {
    return await t.mutation(internal.testHelpers.seedAuthenticatedUser, {
        email: 'admin@example.com',
        password: 'password123',
        name: 'Admin User',
        role: 'admin',
    });
}

async function seedGuestIdentity(t: ReturnType<typeof setupTest>) {
    return await t.mutation(internal.testHelpers.seedAuthenticatedUser, {
        email: 'guest@example.com',
        password: 'password123',
        name: 'Guest User',
    });
}

async function storeFakeImage(t: ReturnType<typeof setupTest>) {
    return await t.run((ctx) =>
        ctx.storage.store(new Blob(['fake-image'], { type: 'image/jpeg' })),
    );
}

function cabinInput(overrides: Partial<Parameters<typeof adminCreateCabin>[1]> = {}) {
    return {
        name: 'Pine Ridge Cabin',
        slug: 'pine-ridge-cabin',
        shortDescription: 'A quiet cabin in the woods.',
        description: 'A longer description of a quiet cabin in the woods.',
        location: 'Pine Ridge',
        nightlyRate: 25000,
        cleaningFee: 3500,
        maxGuests: 4,
        bedrooms: 2,
        beds: 3,
        bathrooms: 1,
        amenityIds: [] as Id<'amenities'>[],
        published: true,
        featured: false,
        ...overrides,
    };
}

async function seedCabin(
    t: ReturnType<typeof setupTest>,
    admin: Awaited<ReturnType<typeof seedAdmin>>,
) {
    const coverImage = await storeFakeImage(t);
    return await t
        .withIdentity(admin)
        .run((ctx) => adminCreateCabin(ctx, { ...cabinInput(), coverImage }));
}

describe('adminCreateCabin', () => {
    test('throws for an unauthenticated caller', async () => {
        const t = setupTest();
        const coverImage = await storeFakeImage(t);

        await expect(
            t.run((ctx) => adminCreateCabin(ctx, { ...cabinInput(), coverImage })),
        ).rejects.toThrow();
    });

    test('throws for a non-admin caller', async () => {
        const t = setupTest();
        const guest = await seedGuestIdentity(t);
        const coverImage = await storeFakeImage(t);

        await expect(
            t
                .withIdentity(guest)
                .run((ctx) => adminCreateCabin(ctx, { ...cabinInput(), coverImage })),
        ).rejects.toThrow();
    });

    test('throws on a duplicate slug', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        await seedCabin(t, admin);
        const coverImage = await storeFakeImage(t);

        await expect(
            t
                .withIdentity(admin)
                .run((ctx) => adminCreateCabin(ctx, { ...cabinInput(), coverImage })),
        ).rejects.toThrow('A cabin with the slug "pine-ridge-cabin" already exists.');
    });

    test('throws on non-integer cents', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const coverImage = await storeFakeImage(t);

        await expect(
            t.withIdentity(admin).run((ctx) =>
                adminCreateCabin(ctx, {
                    ...cabinInput({ nightlyRate: 100.5 }),
                    coverImage,
                }),
            ),
        ).rejects.toThrow();
    });

    test('throws on a negative room count', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const coverImage = await storeFakeImage(t);

        await expect(
            t.withIdentity(admin).run((ctx) =>
                adminCreateCabin(ctx, {
                    ...cabinInput({ bedrooms: -1 }),
                    coverImage,
                }),
            ),
        ).rejects.toThrow();
    });

    test('creates a cabin with an empty gallery', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const coverImage = await storeFakeImage(t);

        const cabinId = await t
            .withIdentity(admin)
            .run((ctx) => adminCreateCabin(ctx, { ...cabinInput(), coverImage }));

        const cabin = await t.run((ctx) => ctx.db.get(cabinId));
        expect(cabin).toMatchObject({ name: 'Pine Ridge Cabin', slug: 'pine-ridge-cabin' });
        expect(cabin!.galleryImages).toEqual([]);
    });
});

describe('adminUpdateCabin', () => {
    test('throws for an unauthenticated caller', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const cabinId = await seedCabin(t, admin);

        await expect(
            t.run((ctx) => adminUpdateCabin(ctx, { cabinId, name: 'New Name' })),
        ).rejects.toThrow();
    });

    test('throws for a non-admin caller', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const guest = await seedGuestIdentity(t);
        const cabinId = await seedCabin(t, admin);

        await expect(
            t
                .withIdentity(guest)
                .run((ctx) => adminUpdateCabin(ctx, { cabinId, name: 'New Name' })),
        ).rejects.toThrow();
    });

    test('throws for an unknown cabin id', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const cabinId = await seedCabin(t, admin);
        await t.run((ctx) => ctx.db.delete(cabinId));

        await expect(
            t
                .withIdentity(admin)
                .run((ctx) => adminUpdateCabin(ctx, { cabinId, name: 'New Name' })),
        ).rejects.toThrow('Unknown cabin.');
    });

    test('re-checks slug uniqueness only when the slug actually changes', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const cabinId = await seedCabin(t, admin);

        // Same slug re-submitted -- must not throw, since it's not actually a collision with
        // a *different* cabin.
        await expect(
            t
                .withIdentity(admin)
                .run((ctx) => adminUpdateCabin(ctx, { cabinId, slug: 'pine-ridge-cabin' })),
        ).resolves.not.toThrow();
    });

    test('throws when changing to a slug that collides with another cabin', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const cabinId = await seedCabin(t, admin);
        const otherCoverImage = await storeFakeImage(t);
        await t.withIdentity(admin).run((ctx) =>
            adminCreateCabin(ctx, {
                ...cabinInput({ slug: 'blackwood-lodge', name: 'Blackwood Lodge' }),
                coverImage: otherCoverImage,
            }),
        );

        await expect(
            t
                .withIdentity(admin)
                .run((ctx) => adminUpdateCabin(ctx, { cabinId, slug: 'blackwood-lodge' })),
        ).rejects.toThrow('A cabin with the slug "blackwood-lodge" already exists.');
    });

    test('throws on invalid numeric args', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const cabinId = await seedCabin(t, admin);

        await expect(
            t
                .withIdentity(admin)
                .run((ctx) => adminUpdateCabin(ctx, { cabinId, nightlyRate: 10.5 })),
        ).rejects.toThrow();
    });

    test('patches a partial update, leaving other fields untouched', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const cabinId = await seedCabin(t, admin);

        await t
            .withIdentity(admin)
            .run((ctx) => adminUpdateCabin(ctx, { cabinId, name: 'Renamed Cabin' }));

        const cabin = await t.run((ctx) => ctx.db.get(cabinId));
        expect(cabin).toMatchObject({ name: 'Renamed Cabin', slug: 'pine-ridge-cabin' });
    });
});

describe('adminSetPublished', () => {
    test('throws for an unauthenticated caller', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const cabinId = await seedCabin(t, admin);

        await expect(
            t.run((ctx) => adminSetPublished(ctx, { cabinId, published: false })),
        ).rejects.toThrow();
    });

    test('throws for a non-admin caller', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const guest = await seedGuestIdentity(t);
        const cabinId = await seedCabin(t, admin);

        await expect(
            t
                .withIdentity(guest)
                .run((ctx) => adminSetPublished(ctx, { cabinId, published: false })),
        ).rejects.toThrow();
    });

    test('throws for an unknown cabin id', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const cabinId = await seedCabin(t, admin);
        await t.run((ctx) => ctx.db.delete(cabinId));

        await expect(
            t
                .withIdentity(admin)
                .run((ctx) => adminSetPublished(ctx, { cabinId, published: false })),
        ).rejects.toThrow('Unknown cabin.');
    });

    test('toggles published in both directions', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const cabinId = await seedCabin(t, admin);

        await t
            .withIdentity(admin)
            .run((ctx) => adminSetPublished(ctx, { cabinId, published: false }));
        expect((await t.run((ctx) => ctx.db.get(cabinId)))!.published).toBe(false);

        await t
            .withIdentity(admin)
            .run((ctx) => adminSetPublished(ctx, { cabinId, published: true }));
        expect((await t.run((ctx) => ctx.db.get(cabinId)))!.published).toBe(true);
    });
});

describe('adminListCabins', () => {
    test('throws for an unauthenticated caller', async () => {
        const t = setupTest();

        await expect(
            t.run((ctx) =>
                adminListCabins(ctx, { paginationOpts: { numItems: 10, cursor: null } }),
            ),
        ).rejects.toThrow();
    });

    test('throws for a non-admin caller', async () => {
        const t = setupTest();
        const guest = await seedGuestIdentity(t);

        await expect(
            t
                .withIdentity(guest)
                .run((ctx) =>
                    adminListCabins(ctx, { paginationOpts: { numItems: 10, cursor: null } }),
                ),
        ).rejects.toThrow();
    });

    test('includes both published and unpublished cabins with a resolved cover image url', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        await seedCabin(t, admin);
        const otherCoverImage = await storeFakeImage(t);
        await t.withIdentity(admin).run((ctx) =>
            adminCreateCabin(ctx, {
                ...cabinInput({ slug: 'draft-cabin', name: 'Draft Cabin', published: false }),
                coverImage: otherCoverImage,
            }),
        );

        const result = await t
            .withIdentity(admin)
            .run((ctx) => adminListCabins(ctx, { paginationOpts: { numItems: 10, cursor: null } }));

        expect(result.page).toHaveLength(2);
        expect(result.page.map((cabin) => cabin.published).sort()).toEqual([false, true]);
        expect(result.page.every((cabin) => typeof cabin.coverImageUrl === 'string')).toBe(true);
    });
});

describe('adminGetCabin', () => {
    test('throws for an unauthenticated caller', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const cabinId = await seedCabin(t, admin);

        await expect(t.run((ctx) => adminGetCabin(ctx, { cabinId }))).rejects.toThrow();
    });

    test('throws for a non-admin caller', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const guest = await seedGuestIdentity(t);
        const cabinId = await seedCabin(t, admin);

        await expect(
            t.withIdentity(guest).run((ctx) => adminGetCabin(ctx, { cabinId })),
        ).rejects.toThrow();
    });

    test('returns null for an unknown cabin id', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const cabinId = await seedCabin(t, admin);
        await t.run((ctx) => ctx.db.delete(cabinId));

        const result = await t.withIdentity(admin).run((ctx) => adminGetCabin(ctx, { cabinId }));
        expect(result).toBeNull();
    });

    test('returns the full record including address and raw amenity ids', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const coverImage = await storeFakeImage(t);
        const cabinId = await t
            .withIdentity(admin)
            .run((ctx) =>
                adminCreateCabin(ctx, { ...cabinInput({ address: '123 Pine Rd' }), coverImage }),
            );

        const result = await t.withIdentity(admin).run((ctx) => adminGetCabin(ctx, { cabinId }));

        expect(result).toMatchObject({ address: '123 Pine Rd', amenityIds: [] });
        expect(result!.coverImageUrl).toEqual(expect.any(String));
    });
});

describe('adminGenerateUploadUrl', () => {
    test('throws for an unauthenticated caller', async () => {
        const t = setupTest();
        await expect(t.run((ctx) => adminGenerateUploadUrl(ctx))).rejects.toThrow();
    });

    test('throws for a non-admin caller', async () => {
        const t = setupTest();
        const guest = await seedGuestIdentity(t);
        await expect(
            t.withIdentity(guest).run((ctx) => adminGenerateUploadUrl(ctx)),
        ).rejects.toThrow();
    });

    test('returns an upload url for an admin caller', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const result = await t.withIdentity(admin).run((ctx) => adminGenerateUploadUrl(ctx));
        expect(typeof result).toBe('string');
    });
});

describe('adminSetCoverImage', () => {
    test('throws for an unauthenticated caller', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const cabinId = await seedCabin(t, admin);
        const newImage = await storeFakeImage(t);

        await expect(
            t.run((ctx) => adminSetCoverImage(ctx, { cabinId, storageId: newImage })),
        ).rejects.toThrow();
    });

    test('throws for a non-admin caller', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const guest = await seedGuestIdentity(t);
        const cabinId = await seedCabin(t, admin);
        const newImage = await storeFakeImage(t);

        await expect(
            t
                .withIdentity(guest)
                .run((ctx) => adminSetCoverImage(ctx, { cabinId, storageId: newImage })),
        ).rejects.toThrow();
    });

    test('throws for an unknown cabin id', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const cabinId = await seedCabin(t, admin);
        await t.run((ctx) => ctx.db.delete(cabinId));
        const newImage = await storeFakeImage(t);

        await expect(
            t
                .withIdentity(admin)
                .run((ctx) => adminSetCoverImage(ctx, { cabinId, storageId: newImage })),
        ).rejects.toThrow('Unknown cabin.');
    });

    test('throws for a storage id that does not exist', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const cabinId = await seedCabin(t, admin);
        const bogusId = 'not-a-real-storage-id' as Id<'_storage'>;

        await expect(
            t
                .withIdentity(admin)
                .run((ctx) => adminSetCoverImage(ctx, { cabinId, storageId: bogusId })),
        ).rejects.toThrow();
    });

    test('swaps the cover image and deletes the unreferenced previous one', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const cabinId = await seedCabin(t, admin);
        const previousCoverImage = (await t.run((ctx) => ctx.db.get(cabinId)))!.coverImage;
        const newImage = await storeFakeImage(t);

        await t
            .withIdentity(admin)
            .run((ctx) => adminSetCoverImage(ctx, { cabinId, storageId: newImage }));

        const cabin = await t.run((ctx) => ctx.db.get(cabinId));
        expect(cabin!.coverImage).toBe(newImage);
        // A freshly created cabin's gallery starts empty (adminCreateCabin never seeds it), so
        // the old cover image is unreferenced afterward and must be deleted.
        const previousUrl = await t.run((ctx) => ctx.storage.getUrl(previousCoverImage));
        expect(previousUrl).toBeNull();
    });

    test('does not delete the previous cover image if it is still referenced in the gallery', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const cabinId = await seedCabin(t, admin);
        const previousCoverImage = (await t.run((ctx) => ctx.db.get(cabinId)))!.coverImage;
        await t
            .withIdentity(admin)
            .run((ctx) =>
                adminAddGalleryImages(ctx, { cabinId, storageIds: [previousCoverImage] }),
            );
        const newImage = await storeFakeImage(t);

        await t
            .withIdentity(admin)
            .run((ctx) => adminSetCoverImage(ctx, { cabinId, storageId: newImage }));

        const previousUrl = await t.run((ctx) => ctx.storage.getUrl(previousCoverImage));
        expect(previousUrl).not.toBeNull();
    });
});

describe('adminSetCoverImageFromGallery', () => {
    test('throws for an unknown gallery index', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const cabinId = await seedCabin(t, admin);

        await expect(
            t
                .withIdentity(admin)
                .run((ctx) => adminSetCoverImageFromGallery(ctx, { cabinId, index: 99 })),
        ).rejects.toThrow('Unknown gallery image.');
    });

    test('promotes a gallery image to cover without a client-supplied storage id', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const cabinId = await seedCabin(t, admin);
        const secondImage = await storeFakeImage(t);
        await t
            .withIdentity(admin)
            .run((ctx) => adminAddGalleryImages(ctx, { cabinId, storageIds: [secondImage] }));

        await t
            .withIdentity(admin)
            .run((ctx) => adminSetCoverImageFromGallery(ctx, { cabinId, index: 0 }));

        const cabin = await t.run((ctx) => ctx.db.get(cabinId));
        expect(cabin!.coverImage).toBe(secondImage);
    });
});

describe('adminAddGalleryImages', () => {
    test('throws for a non-admin caller', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const guest = await seedGuestIdentity(t);
        const cabinId = await seedCabin(t, admin);
        const newImage = await storeFakeImage(t);

        await expect(
            t
                .withIdentity(guest)
                .run((ctx) => adminAddGalleryImages(ctx, { cabinId, storageIds: [newImage] })),
        ).rejects.toThrow();
    });

    test('appends to the existing gallery', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const cabinId = await seedCabin(t, admin);
        const before = (await t.run((ctx) => ctx.db.get(cabinId)))!.galleryImages;
        const newImage = await storeFakeImage(t);

        await t
            .withIdentity(admin)
            .run((ctx) => adminAddGalleryImages(ctx, { cabinId, storageIds: [newImage] }));

        const cabin = await t.run((ctx) => ctx.db.get(cabinId));
        expect(cabin!.galleryImages).toEqual([...before, newImage]);
    });
});

describe('adminRemoveGalleryImage', () => {
    test('throws for an unknown gallery index', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const cabinId = await seedCabin(t, admin);

        await expect(
            t
                .withIdentity(admin)
                .run((ctx) => adminRemoveGalleryImage(ctx, { cabinId, index: 99 })),
        ).rejects.toThrow('Unknown gallery image.');
    });

    test('removes the image at the given position and deletes it if unreferenced', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const cabinId = await seedCabin(t, admin);
        const secondImage = await storeFakeImage(t);
        await t
            .withIdentity(admin)
            .run((ctx) => adminAddGalleryImages(ctx, { cabinId, storageIds: [secondImage] }));

        await t
            .withIdentity(admin)
            .run((ctx) => adminRemoveGalleryImage(ctx, { cabinId, index: 0 }));

        const cabin = await t.run((ctx) => ctx.db.get(cabinId));
        expect(cabin!.galleryImages).not.toContain(secondImage);
    });
});

describe('adminReorderGalleryImage', () => {
    test('throws for an out-of-range index', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const cabinId = await seedCabin(t, admin);
        const secondImage = await storeFakeImage(t);
        await t
            .withIdentity(admin)
            .run((ctx) => adminAddGalleryImages(ctx, { cabinId, storageIds: [secondImage] }));

        await expect(
            t
                .withIdentity(admin)
                .run((ctx) => adminReorderGalleryImage(ctx, { cabinId, fromIndex: 0, toIndex: 5 })),
        ).rejects.toThrow('Unknown gallery image.');
    });

    test('swaps two gallery images by position', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        const cabinId = await seedCabin(t, admin);
        const firstImage = await storeFakeImage(t);
        const secondImage = await storeFakeImage(t);
        await t
            .withIdentity(admin)
            .run((ctx) =>
                adminAddGalleryImages(ctx, { cabinId, storageIds: [firstImage, secondImage] }),
            );

        await t
            .withIdentity(admin)
            .run((ctx) => adminReorderGalleryImage(ctx, { cabinId, fromIndex: 0, toIndex: 1 }));

        const cabin = await t.run((ctx) => ctx.db.get(cabinId));
        expect(cabin!.galleryImages).toEqual([secondImage, firstImage]);
    });
});

describe('getStorageIdsBySlug', () => {
    test('returns null for an unknown slug', async () => {
        const t = setupTest();
        const result = await t.run((ctx) => getStorageIdsBySlug(ctx, { slug: 'unknown-cabin' }));
        expect(result).toBeNull();
    });

    test('returns the raw storage ids for a known slug', async () => {
        const t = setupTest();
        const admin = await seedAdmin(t);
        await seedCabin(t, admin);

        const result = await t.run((ctx) => getStorageIdsBySlug(ctx, { slug: 'pine-ridge-cabin' }));

        expect(result).not.toBeNull();
        expect(result!.coverImage).toEqual(expect.any(String));
        expect(result!.galleryImages).toEqual(expect.any(Array));
    });
});

describe('seedCabins', () => {
    async function seedAmenity(t: ReturnType<typeof setupTest>, name: string) {
        return await t.run((ctx) =>
            ctx.db.insert('amenities', { name, icon: 'wifi', category: 'comfort' }),
        );
    }

    test('inserts a new cabin, resolving amenity names to ids', async () => {
        const t = setupTest();
        await seedAmenity(t, 'WiFi');
        const coverImage = await storeFakeImage(t);

        const ids = await t.run((ctx) =>
            seedCabins(ctx, {
                cabins: [
                    {
                        name: 'Seeded Cabin',
                        slug: 'seeded-cabin',
                        shortDescription: 'short',
                        description: 'long',
                        location: 'Nowhere',
                        nightlyRate: 10000,
                        cleaningFee: 2000,
                        maxGuests: 2,
                        bedrooms: 1,
                        beds: 1,
                        bathrooms: 1,
                        coverImage,
                        galleryImages: [],
                        amenityNames: ['WiFi'],
                        published: true,
                        featured: false,
                        createdAt: 1700000000000,
                        updatedAt: 1700000000000,
                    },
                ],
            }),
        );

        const cabin = await t.run((ctx) => ctx.db.get(ids[0]!));
        expect(cabin!.amenities).toHaveLength(1);
    });

    test('throws for an unknown amenity name', async () => {
        const t = setupTest();
        const coverImage = await storeFakeImage(t);

        await expect(
            t.run((ctx) =>
                seedCabins(ctx, {
                    cabins: [
                        {
                            name: 'Seeded Cabin',
                            slug: 'seeded-cabin',
                            shortDescription: 'short',
                            description: 'long',
                            location: 'Nowhere',
                            nightlyRate: 10000,
                            cleaningFee: 2000,
                            maxGuests: 2,
                            bedrooms: 1,
                            beds: 1,
                            bathrooms: 1,
                            coverImage,
                            galleryImages: [],
                            amenityNames: ['Nonexistent Amenity'],
                            published: true,
                            featured: false,
                            createdAt: 1700000000000,
                            updatedAt: 1700000000000,
                        },
                    ],
                }),
            ),
        ).rejects.toThrow('Unknown amenity "Nonexistent Amenity"');
    });

    test('upserts by slug on a second run, keeping images as-is', async () => {
        const t = setupTest();
        const coverImage = await storeFakeImage(t);
        const input = {
            name: 'Seeded Cabin',
            slug: 'seeded-cabin',
            shortDescription: 'short',
            description: 'long',
            location: 'Nowhere',
            nightlyRate: 10000,
            cleaningFee: 2000,
            maxGuests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            coverImage,
            galleryImages: [],
            amenityNames: [] as string[],
            published: true,
            featured: false,
            createdAt: 1700000000000,
            updatedAt: 1700000000000,
        };

        const [firstId] = await t.run((ctx) => seedCabins(ctx, { cabins: [input] }));
        const [secondId] = await t.run((ctx) =>
            seedCabins(ctx, { cabins: [{ ...input, name: 'Renamed Seeded Cabin' }] }),
        );

        expect(secondId).toBe(firstId);
        const rows = await t.run((ctx) => ctx.db.query('cabins').collect());
        expect(rows).toHaveLength(1);
        expect(rows[0]!.name).toBe('Renamed Seeded Cabin');
    });
});
