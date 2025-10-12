import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { defaultColumns } from '../helpers';

export const amenities = sqliteTable('amenities', {
	...defaultColumns,
	name: text('name').notNull(),
	group: text('group').notNull()
});

export const amenitiesRelations = relations(amenities, ({ many }) => ({
	// cabins: many(cabinsToAmenities),
}));

export type Amenity = typeof amenities.$inferSelect;
export type NewAmenity = typeof amenities.$inferInsert;
