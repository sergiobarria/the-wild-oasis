import { env } from '@/env';
import { type Media } from '@/payload-types';

export function generateMediaURL(path?: string): string {
	const BASE_URL = env.NEXT_PUBLIC_APP_BASE_URL;
	if (!path) return `${BASE_URL}/placeholder.jpg`;

	return `${BASE_URL}${path}`;
}

/**
 * Gets the URL of the first image or a default placeholder if no image is available.
 */
export function getFirstImageURL(
	images: Media[] | undefined,
	size: keyof NonNullable<Media['sizes']> = 'thumbnail', // Ensure sizes is not undefined
): string {
	if (!images || images.length === 0) {
		return generateMediaURL();
	}
	const firstImage = images[0];
	const imageURL = firstImage.sizes?.[size]?.url || firstImage.url;

	return generateMediaURL(imageURL || '');
}

/**
 * Extracts the alt text for the first image or returns a default value.
 */
export function getFirstImageAlt(images: Media[] | undefined, defaultAlt = 'Image'): string {
	return images?.[0]?.alt || defaultAlt;
}
