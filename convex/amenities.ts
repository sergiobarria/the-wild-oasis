import { v } from 'convex/values';

import { internalMutation, mutation, query } from './_generated/server';
import { AMENITY_CATEGORY, amenityCategoryValidator, amenityIconValidator } from './lib/amenities';
import * as Amenities from './model/amenities';

export { AMENITY_CATEGORY };

const amenityValidator = v.object({
    _id: v.id('amenities'),
    _creationTime: v.number(),
    name: v.string(),
    icon: v.string(),
    category: amenityCategoryValidator,
});

const adminAmenityInput = {
    name: v.string(),
    icon: amenityIconValidator,
    category: amenityCategoryValidator,
};

export const list = query({
    args: {},
    returns: v.array(amenityValidator),
    handler: async (ctx) => await Amenities.listAmenities(ctx),
});

export const adminListAmenities = query({
    args: {},
    returns: v.array(amenityValidator),
    handler: async (ctx) => await Amenities.adminListAmenities(ctx),
});

export const adminCreateAmenity = mutation({
    args: adminAmenityInput,
    returns: v.id('amenities'),
    handler: async (ctx, args) => await Amenities.adminCreateAmenity(ctx, args),
});

export const adminUpdateAmenity = mutation({
    args: { amenityId: v.id('amenities'), ...adminAmenityInput },
    returns: v.null(),
    handler: async (ctx, args) => {
        await Amenities.adminUpdateAmenity(ctx, args);
        return null;
    },
});

export const adminDeleteAmenity = mutation({
    args: { amenityId: v.id('amenities') },
    returns: v.null(),
    handler: async (ctx, args) => {
        await Amenities.adminDeleteAmenity(ctx, args);
        return null;
    },
});

export const seedAmenities = internalMutation({
    args: {},
    returns: v.array(v.id('amenities')),
    handler: async (ctx) => await Amenities.seedAmenities(ctx),
});
