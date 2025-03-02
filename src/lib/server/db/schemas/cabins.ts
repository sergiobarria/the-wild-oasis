import { relations } from 'drizzle-orm';
import { pgTable, varchar } from 'drizzle-orm/pg-core';

import { defaultColumns } from './helpers';

export const cabins = pgTable('cabins', {
	...defaultColumns,
	name: varchar('name').notNull().unique(),
	slug: varchar('slug').notNull().unique()
});

export const cabinsRelations = relations(cabins, () => ({}));

export type Cabin = typeof cabins.$inferSelect;
export type CabinInsert = typeof cabins.$inferInsert;
