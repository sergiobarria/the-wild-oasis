import { createId } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';
import { integer, text } from 'drizzle-orm/sqlite-core';

export const primaryKey = {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId())
};

export const timestamps = {
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull()
};

export const defaultColumns = {
	...primaryKey,
	...timestamps
};
