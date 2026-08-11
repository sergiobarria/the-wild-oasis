import { z } from 'zod';

import { AMENITY_CATEGORY } from '@/convex/lib/amenities';

export const amenityFormSchema = z.object({
    name: z.string().trim().min(1, 'Name is required.'),
    icon: z.string().min(1, 'Pick an icon.'),
    category: z.string().min(1, 'Pick a category.'),
});

export type AmenityFormValues = z.infer<typeof amenityFormSchema>;

export const amenityFormDefaultValues: AmenityFormValues = {
    name: '',
    icon: '',
    category: '',
};

export const AMENITY_CATEGORY_LABELS: Record<string, string> = {
    [AMENITY_CATEGORY.ESSENTIALS]: 'Essentials',
    [AMENITY_CATEGORY.KITCHEN]: 'Kitchen',
    [AMENITY_CATEGORY.OUTDOOR]: 'Outdoor',
    [AMENITY_CATEGORY.COMFORT]: 'Comfort',
    [AMENITY_CATEGORY.ENTERTAINMENT]: 'Entertainment',
    [AMENITY_CATEGORY.ACCESSIBILITY]: 'Accessibility',
};
