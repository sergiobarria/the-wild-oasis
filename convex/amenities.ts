import { v } from 'convex/values';

import { internalMutation, query } from './_generated/server';
import { AMENITY_CATEGORY, amenityCategoryValidator } from './lib/amenities';
import * as Amenities from './model/amenities';

export { AMENITY_CATEGORY };

const amenityValidator = v.object({
    _id: v.id('amenities'),
    _creationTime: v.number(),
    name: v.string(),
    icon: v.string(),
    category: amenityCategoryValidator,
});

export const list = query({
    args: {},
    returns: v.array(amenityValidator),
    handler: async (ctx) => await Amenities.listAmenities(ctx),
});

export const seedAmenities = internalMutation({
    args: {},
    returns: v.array(v.id('amenities')),
    handler: async (ctx) => await Amenities.seedAmenities(ctx),
});
