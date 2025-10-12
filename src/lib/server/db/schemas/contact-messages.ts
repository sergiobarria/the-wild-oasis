import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { defaultColumns } from '../helpers';

export const contactMessages = sqliteTable('contact_messages', {
	...defaultColumns,
	name: text('name').notNull(),
	email: text('email').notNull(),
	phone: text('phone'),
	subject: text('subject').notNull(),
	message: text('message').notNull()
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
