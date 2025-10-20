import { SvelteDate } from 'svelte/reactivity';

import { getLocalTimeZone } from '@internationalized/date';
import type { DateRange } from 'bits-ui';
import { isAfter, isBefore, startOfDay } from 'date-fns';

import { bookingConfig } from '$lib/config/booking';
import type { BookingValidationInput, ValidationError, ValidationResult } from '$lib/types/booking';

import { calculateBookingNights } from './calculations';

/**
 * Validate the selected date range
 * @param dates - The selected date range
 * @returns An array of validation errors, if any
 */
export function validateDates(dates?: DateRange): ValidationError[] {
	const errors: ValidationError[] = [];

	if (!dates?.start) {
		errors.push({ field: 'checkIn', message: 'Check-in date is required' });
		return errors;
	}

	if (!dates?.end) {
		errors.push({ field: 'checkOut', message: 'Check-out date is required' });
		return errors;
	}

	const localTz = getLocalTimeZone();
	const today = startOfDay(new SvelteDate());
	const checkInDate = startOfDay(dates.start.toDate(localTz));
	const checkOutDate = startOfDay(dates.end.toDate(localTz));

	// Check-in date must be today or in the future
	if (isBefore(checkInDate, today)) {
		errors.push({ field: 'dateRange', message: 'Check-in date cannot be in the past' });
		return errors;
	}

	// Check-out date must be after check-in date
	if (!isAfter(checkOutDate, checkInDate)) {
		errors.push({ field: 'dateRange', message: 'Check-out date must be after check-in date' });
	}

	// Calculate nights
	const nights = calculateBookingNights(dates);

	if (nights < bookingConfig.minNights) {
		errors.push({
			field: 'dateRange',
			message: `Minimum stay is ${bookingConfig.minNights} nights`
		});
	}

	// Validate max nights if set
	if (nights > bookingConfig.maxNights) {
		errors.push({
			field: 'dateRange',
			message: `Maximum stay is ${bookingConfig.maxNights} nights`
		});
	}

	return errors;
}

export function validateGuests(guests?: number, maxGuests?: number): ValidationError[] {
	const errors: ValidationError[] = [];
	const max = maxGuests ?? bookingConfig.maxGuests;

	if (!guests) {
		errors.push({ field: 'guests', message: 'Number of guests is required' });
		return errors;
	}

	if (guests < 1) {
		errors.push({ field: 'guests', message: 'At least one guest is required' });
	}

	if (guests > max) {
		errors.push({ field: 'guests', message: `Maximum number of guests is ${maxGuests}` });
	}

	return errors;
}

// TODO: Validate against blocked dates (availability + blackout dates)
// ...

export function validateBooking(input: BookingValidationInput): ValidationResult {
	const { dateRange, guests, maxGuests } = input;

	const errors: ValidationError[] = [
		...validateDates(dateRange),
		...validateGuests(guests, maxGuests)
		// TODO: Validate against blocked dates
		// ...
	];

	return {
		isValid: errors.length === 0,
		errors
	};
}

/**
 * Get the error message for a specific field from validation errors
 * @param errors - The array of validation errors
 * @param field - The field to get the error message for
 * @returns The error message or undefined if not found
 */
export function getFieldError(errors: ValidationError[], field: string): string | undefined {
	return errors.find((error) => error.field === field)?.message;
}
