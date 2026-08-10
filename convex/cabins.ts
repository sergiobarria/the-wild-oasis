import { paginationOptsValidator, paginationResultValidator } from 'convex/server';
import { v } from 'convex/values';

import { internalMutation, internalQuery, mutation, query } from './_generated/server';
import { amenityCategoryValidator } from './lib/amenities';
import * as Cabins from './model/cabins';
import { reviewValidator } from './reviews';

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

export const listPublished = query({
    args: { paginationOpts: paginationOptsValidator, featuredOnly: v.optional(v.boolean()) },
    returns: paginationResultValidator(cabinCardValidator),
    handler: async (ctx, args) => await Cabins.listPublished(ctx, args),
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

export const listFiltered = query({
    args: {
        name: v.optional(v.string()),
        guests: v.optional(v.number()),
        maxPriceCents: v.optional(v.number()),
        amenityIds: v.optional(v.array(v.id('amenities'))),
    },
    returns: v.array(cabinListingCardValidator),
    handler: async (ctx, args) => await Cabins.listFiltered(ctx, args),
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
    reviews: v.array(reviewValidator),
    averageRating: v.union(v.number(), v.null()),
    reviewCount: v.number(),
});

export const getBySlug = query({
    args: { slug: v.string() },
    returns: v.union(cabinDetailValidator, v.null()),
    handler: async (ctx, args) => await Cabins.getBySlug(ctx, args),
});

const cabinSummaryCardValidator = v.object({
    _id: v.id('cabins'),
    name: v.string(),
    slug: v.string(),
    location: v.string(),
    nightlyRate: v.number(),
    cleaningFee: v.number(),
    maxGuests: v.number(),
    coverImageUrl: v.union(v.string(), v.null()),
});

export const getById = query({
    args: { cabinId: v.id('cabins') },
    returns: v.union(cabinSummaryCardValidator, v.null()),
    handler: async (ctx, args) => await Cabins.getById(ctx, args),
});

// Defined once via `v.object(...)`, then derived with `.fields`/`.partial()` for
// adminCreateCabin/adminUpdateCabin below (per convex/_generated/ai/guidelines.md: "define a
// shape once and derive variants instead of duplicating fields") -- a future field added here
// automatically appears in both mutations' args instead of needing two hand-edits.
const adminCabinInputValidator = v.object({
    name: v.string(),
    slug: v.string(),
    shortDescription: v.string(),
    description: v.string(),
    location: v.string(),
    address: v.optional(v.string()),
    nightlyRate: v.number(),
    cleaningFee: v.number(),
    maxGuests: v.number(),
    bedrooms: v.number(),
    beds: v.number(),
    bathrooms: v.number(),
    amenityIds: v.array(v.id('amenities')),
    published: v.boolean(),
    featured: v.boolean(),
});

export const adminCreateCabin = mutation({
    args: { ...adminCabinInputValidator.fields, coverImage: v.id('_storage') },
    returns: v.id('cabins'),
    handler: async (ctx, args) => await Cabins.adminCreateCabin(ctx, args),
});

export const adminUpdateCabin = mutation({
    args: { cabinId: v.id('cabins'), ...adminCabinInputValidator.partial().fields },
    returns: v.null(),
    handler: async (ctx, args) => {
        await Cabins.adminUpdateCabin(ctx, args);
        return null;
    },
});

export const adminSetPublished = mutation({
    args: { cabinId: v.id('cabins'), published: v.boolean() },
    returns: v.null(),
    handler: async (ctx, args) => {
        await Cabins.adminSetPublished(ctx, args);
        return null;
    },
});

const adminCabinRowValidator = v.object({
    _id: v.id('cabins'),
    name: v.string(),
    slug: v.string(),
    nightlyRate: v.number(),
    maxGuests: v.number(),
    coverImageUrl: v.union(v.string(), v.null()),
    published: v.boolean(),
    featured: v.boolean(),
});

export const adminListCabins = query({
    args: { paginationOpts: paginationOptsValidator },
    returns: paginationResultValidator(adminCabinRowValidator),
    handler: async (ctx, args) => await Cabins.adminListCabins(ctx, args),
});

const adminCabinDetailValidator = v.object({
    _id: v.id('cabins'),
    name: v.string(),
    slug: v.string(),
    shortDescription: v.string(),
    description: v.string(),
    location: v.string(),
    address: v.optional(v.string()),
    nightlyRate: v.number(),
    cleaningFee: v.number(),
    maxGuests: v.number(),
    bedrooms: v.number(),
    beds: v.number(),
    bathrooms: v.number(),
    coverImage: v.object({ storageId: v.id('_storage'), url: v.union(v.string(), v.null()) }),
    gallery: v.array(v.object({ storageId: v.id('_storage'), url: v.union(v.string(), v.null()) })),
    amenityIds: v.array(v.id('amenities')),
    published: v.boolean(),
    featured: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
});

export const adminGetCabin = query({
    args: { cabinId: v.id('cabins') },
    returns: v.union(adminCabinDetailValidator, v.null()),
    handler: async (ctx, args) => await Cabins.adminGetCabin(ctx, args),
});

export const adminGenerateUploadUrl = mutation({
    args: {},
    returns: v.string(),
    handler: async (ctx) => await Cabins.adminGenerateUploadUrl(ctx),
});

export const adminSetCoverImage = mutation({
    args: { cabinId: v.id('cabins'), storageId: v.id('_storage') },
    returns: v.null(),
    handler: async (ctx, args) => {
        await Cabins.adminSetCoverImage(ctx, args);
        return null;
    },
});

export const adminSetGalleryImages = mutation({
    args: { cabinId: v.id('cabins'), storageIds: v.array(v.id('_storage')) },
    returns: v.null(),
    handler: async (ctx, args) => {
        await Cabins.adminSetGalleryImages(ctx, args);
        return null;
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

export const getStorageIdsBySlug = internalQuery({
    args: { slug: v.string() },
    returns: v.union(
        v.object({ coverImage: v.id('_storage'), galleryImages: v.array(v.id('_storage')) }),
        v.null(),
    ),
    handler: async (ctx, args) => await Cabins.getStorageIdsBySlug(ctx, args),
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

export const seedCabins = internalMutation({
    args: { cabins: v.array(seedCabinValidator) },
    returns: v.array(v.id('cabins')),
    handler: async (ctx, args) => await Cabins.seedCabins(ctx, args),
});
