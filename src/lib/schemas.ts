import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { cabins } from './db/schemas';

const InsertCabinSchema = createInsertSchema(cabins);
const SelectCabinSchema = createSelectSchema(cabins);

export type InsertCabin = z.infer<typeof InsertCabinSchema>;
export type Cabin = z.infer<typeof SelectCabinSchema>;
