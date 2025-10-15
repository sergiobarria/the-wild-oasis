import { createEnv } from '@t3-oss/env-core'
import * as z from 'zod'

export const env = createEnv({
    clientPrefix: 'VITE_',
    client: {
        VITE_APP_URL: z.url().default('http://localhost:3000'),
        VITE_BOOKING_CLEANING_FEE: z.coerce.number().default(0),
        VITE_BOOKING_FEE_PERCENTAGE: z.coerce.number().default(0),
        VITE_BOOKING_PROCESSING_FEE_PERCENTAGE: z.coerce.number().default(0),
        VITE_BOOKING_SERVICE_FEE_PERCENTAGE: z.coerce.number().default(0),
        VITE_BOOKING_TAX_RATE: z.coerce.number().default(0),
        VITE_BOOKING_MAX_GUESTS: z.coerce.number().default(20),
        VITE_BOOKING_MAX_NIGHTS: z.coerce.number().default(365),
        VITE_BOOKING_MIN_NIGHTS: z.coerce.number().default(2),
    },
    runtimeEnv: import.meta.env,
})
