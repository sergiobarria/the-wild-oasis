import { error as svelteKitError } from '@sveltejs/kit';

import type { ZodError } from 'zod';

/**
 * Throw a validation error (400)
 */
export function validationError(message: string, details?: string): never {
	throw svelteKitError(400, {
		message,
		details,
		code: 'VALIDATION_ERROR'
	});
}

/**
 * Throw a not found error (404)
 */
export function notFoundError(message: string = 'Not found', details?: string): never {
	throw svelteKitError(404, {
		message,
		details,
		code: 'NOT_FOUND'
	});
}

/**
 * Throw an unauthorized error (401)
 */
export function unauthorizedError(message: string = 'Unauthorized', details?: string): never {
	svelteKitError(401, {
		message,
		details,
		code: 'UNAUTHORIZED'
	});
}

/**
 * Throw a forbidden error (403)
 */
export function forbiddenError(message: string = 'Forbidden', details?: string): never {
	svelteKitError(403, {
		message,
		details,
		code: 'FORBIDDEN'
	});
}

/**
 * Throw a server error (500)
 */
export function serverError(message: string = 'Internal server error', details?: string): never {
	svelteKitError(500, {
		message,
		details,
		code: 'SERVER_ERROR'
	});
}

/**
 * Handle Zod validation errors
 */
export function handleZodError(
	zodError: ZodError,
	defaultMessage: string = 'Validation failed'
): never {
	const details = zodError.issues
		.map((issue) => `${issue.path.join('.')}: ${issue.message}`)
		.join('; ');

	validationError(defaultMessage, details);
}
