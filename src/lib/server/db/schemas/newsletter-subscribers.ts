import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { defaultColumns } from '../helpers';

export const newsletterSubscribers = sqliteTable('newsletter_subscribers', {
	...defaultColumns,
	email: text('email').notNull().unique(),
	subscribedAt: integer('subscribed_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull()
});

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;
