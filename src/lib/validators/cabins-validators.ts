import { MAX_IMAGE_SIZE } from '$lib/config/constants';
import * as v from 'valibot';

export const CreateCabinSchema = v.object({
	name: v.pipe(
		v.string('Name is required'),
		v.minLength(3, 'Name must be at least 3 characters long'),
		v.maxLength(100, 'Name must be at most 100 characters long'),
		v.regex(/^[a-zA-Z0-9 ]+$/, 'Name must contain only letters, numbers, and spaces')
	),
	maxCapacity: v.pipe(
		v.string('Max capacity is required'),
		v.transform((input) => Number(input)),
		v.minValue(1, 'Max capacity must be at least 1')
	),
	price: v.pipe(
		v.string('Price is required'),
		v.transform((input) => Number(input)),
		v.minValue(1, 'Price must be at least 1')
	),
	discountPercentage: v.optional(
		v.pipe(
			v.string(),
			v.transform((input) => Number(input)),
			v.minValue(0, 'Discount must be at least 0'),
			v.maxValue(100, 'Discount must be at most 100')
		)
	),
	description: v.nullish(
		v.pipe(v.string(), v.maxLength(10000, 'Description must be at most 10000 characters long'))
	),
	images: v.optional(
		v.pipe(
			v.array(
				v.pipe(
					v.file('Please select an image file.'),
					v.mimeType(
						['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
						'Please select a JPEG, PNG, WebP or JPG file.'
					),
					v.maxSize(MAX_IMAGE_SIZE, 'Please select a file smaller than 10 MB.')
				)
			),
			v.maxLength(10, 'Maximum 10 images allowed')
		)
	)
});
