import { z } from 'zod';

/** Native `<input type="date">` values, always compared as ISO `YYYY-MM-DD` strings. */
export const availabilitySearchSchema = z
    .object({
        checkIn: z.string(),
        checkOut: z.string(),
        guests: z.string(),
    })
    .refine((data) => !data.checkIn || !data.checkOut || data.checkOut > data.checkIn, {
        message: 'Check-out must be after check-in.',
        path: ['checkOut'],
    });

export type AvailabilitySearchValues = z.infer<typeof availabilitySearchSchema>;

export const availabilitySearchDefaultValues: AvailabilitySearchValues = {
    checkIn: '',
    checkOut: '',
    guests: '2',
};
