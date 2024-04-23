import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import * as schemas from './db/schema';

export const InsertCabinSchema = createInsertSchema(schemas.cabins);
export const SelectCabinSchema = createSelectSchema(schemas.cabins);

export type Cabin = z.infer<typeof SelectCabinSchema>;
