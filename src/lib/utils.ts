import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { PUBLIC_BUCKET_BASE_URL } from '$env/static/public';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	}).format(value);
}

/**
 * Converts a FormData object to a plain JavaScript object.
 * @param formData The FormData object to convert.
 * @returns A plain JavaScript object containing the key-value pairs from the FormData object.
 */
export function formDataToObject(formData: FormData): Record<string, any> {
	const obj: Record<string, any> = {};

	for (const [key, value] of formData.entries()) {
		if (key === 'images') {
			// Handle multiple files
			if (!obj[key]) {
				obj[key] = [];
			}
			if ((value as File).size > 0) {
				// Only add non-empty files
				obj[key].push(value);
			}
		} else if (obj[key]) {
			// If the key already exists, convert to array
			if (Array.isArray(obj[key])) {
				obj[key].push(value);
			} else {
				obj[key] = [obj[key], value];
			}
		} else {
			obj[key] = value;
		}
	}

	// If images is empty, set it to undefined
	if (obj.images && obj.images.length === 0) {
		obj.images = undefined;
	}

	return obj;
}

export function getMediaUrl(key: string) {
	return PUBLIC_BUCKET_BASE_URL + '/' + key;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
