import { z } from 'zod';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function positiveNumberString(message: string) {
    return z
        .string()
        .trim()
        .min(1, message)
        .refine((value) => Number.isFinite(Number(value)) && Number(value) >= 0, {
            message: 'Enter a valid number.',
        });
}

/** For whole-count fields (maxGuests/bedrooms/beds/bathrooms) -- the backend's
 *  `assertNonNegativeInteger` rejects a fraction, so this must too, or a value that passes
 *  client validation still throws server-side with no field to attribute the error to. */
function positiveIntegerString(message: string) {
    return positiveNumberString(message).refine((value) => Number.isInteger(Number(value)), {
        message: 'Enter a whole number.',
    });
}

export const cabinFormSchema = z.object({
    name: z.string().trim().min(1, 'Enter a name.'),
    slug: z
        .string()
        .trim()
        .min(1, 'Enter a slug.')
        .regex(SLUG_PATTERN, 'Use lowercase letters, numbers, and hyphens only.'),
    shortDescription: z.string().trim().min(1, 'Enter a short description.'),
    description: z.string().trim().min(1, 'Enter a description.'),
    location: z.string().trim().min(1, 'Enter a location.'),
    address: z.string().trim(),
    nightlyRate: positiveNumberString('Enter a nightly rate.'),
    cleaningFee: positiveNumberString('Enter a cleaning fee.'),
    maxGuests: positiveIntegerString('Enter the max number of guests.'),
    bedrooms: positiveIntegerString('Enter the number of bedrooms.'),
    beds: positiveIntegerString('Enter the number of beds.'),
    bathrooms: positiveIntegerString('Enter the number of bathrooms.'),
    amenityIds: z.array(z.string()),
    published: z.boolean(),
    featured: z.boolean(),
});

export type CabinFormValues = z.infer<typeof cabinFormSchema>;

export const cabinFormDefaultValues: CabinFormValues = {
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    location: '',
    address: '',
    nightlyRate: '',
    cleaningFee: '',
    maxGuests: '',
    bedrooms: '',
    beds: '',
    bathrooms: '',
    amenityIds: [],
    published: false,
    featured: false,
};

/** Suggests a URL-safe slug from a cabin name -- a starting point the admin can still edit,
 *  not an enforced transform (spec allows any slug matching `SLUG_PATTERN`). */
export function slugify(name: string): string {
    return name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
