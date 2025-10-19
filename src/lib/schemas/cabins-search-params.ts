import { z } from 'zod';

export const CabinsSearchParamsSchema = z.object({
	search: z.string().default('')
});
