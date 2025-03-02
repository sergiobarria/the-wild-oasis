import { createId } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';
import { timestamp, varchar } from 'drizzle-orm/pg-core';

export const columnId = varchar('id')
	.primaryKey()
	.$defaultFn(() => createId());

export const timestamps = {
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').$onUpdateFn(() => sql`now()`)
};

export const defaultColumns = {
	id: columnId,
	...timestamps
};
