// database/schemas/cabins.ts
import { relations } from 'drizzle-orm'
import { integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { amenities } from './amenities'
import { defaultColumns } from './helpers'
import { reviews } from './reviews'

export const cabins = sqliteTable('cabins', {
    ...defaultColumns,
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    pricePerNight: real('price_per_night').notNull(),
    discountPercentage: real('discount_percentage'),
    summary: text('summary').notNull(),
    maxGuests: integer('max_guests').notNull(),
    beds: integer('beds').notNull(),
    baths: integer('baths').notNull(),
    description: text('description'),
})

export const cabinsToAmenities = sqliteTable(
    'cabins_amenities',
    {
        cabinId: text('cabin_id')
            .notNull()
            .references(() => cabins.id, { onDelete: 'cascade' }),
        amenityId: text('amenity_id')
            .notNull()
            .references(() => amenities.id, { onDelete: 'cascade' }),
    },
    (t) => [primaryKey({ columns: [t.cabinId, t.amenityId] })],
)

// ======== RELATIONS ========
export const cabinsRelations = relations(cabins, ({ many }) => ({
    amenities: many(cabinsToAmenities),
    reviews: many(reviews),
}))

export const cabinsToAmenitiesRelations = relations(cabinsToAmenities, ({ one }) => ({
    cabin: one(cabins, {
        fields: [cabinsToAmenities.cabinId],
        references: [cabins.id],
    }),
    amenity: one(amenities, {
        fields: [cabinsToAmenities.amenityId],
        references: [amenities.id],
    }),
}))

// ======== TYPES ========
export type Cabin = typeof cabins.$inferSelect
export type NewCabin = typeof cabins.$inferInsert
