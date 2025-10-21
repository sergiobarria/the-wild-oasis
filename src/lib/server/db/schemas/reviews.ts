import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { defaultColumns } from '../helpers';
import { cabins } from './cabins';
import { users } from './users';

export const reviews = sqliteTable('reviews', {
	...defaultColumns,
	cabinId: text('cabin_id')
		.notNull()
		.references(() => cabins.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	rating: integer('rating').notNull(),
	comment: text('comment').notNull(),
	author_name: text('author_name').notNull()
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
	cabin: one(cabins, {
		fields: [reviews.cabinId],
		references: [cabins.id]
	}),
	user: one(users, {
		fields: [reviews.userId],
		references: [users.id]
	})
}));

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
