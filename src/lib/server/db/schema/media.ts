import { createId } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const media = sqliteTable(
	'media',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => createId()),
		key: text('key', { length: 500 }).notNull().unique(),
		filename: text('filename', { length: 255 }).notNull(),
		contentType: text('content_type', { length: 100 }),
		size: integer('size'),
		resourceType: text('resource_type', { length: 50 }).notNull(),
		resourceId: text('resource_id', { length: 50 }).notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`(current_timestamp)`),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
	},
	(table) => ({
		resourceIdx: index('idx_media_resource').on(table.resourceType, table.resourceId),
		keyIdx: index('idx_media_key').on(table.key)
	})
);
