import { relations } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { defaultColumns } from '../helpers'
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

// ======== RELATIONS ========
export const cabinsRelations = relations(cabins, ({ many }) => ({
    reviews: many(reviews),
}))

// ======== TYPES ========
export type Cabin = typeof cabins.$inferSelect
export type NewCabin = typeof cabins.$inferInsert
