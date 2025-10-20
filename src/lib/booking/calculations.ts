import { getLocalTimeZone } from '@internationalized/date';
import type { DateRange } from 'bits-ui';

import { bookingConfig } from '$lib/config/booking';
import type { BookingInput, BookingPriceBreakdown } from '$lib/types/booking';

/**
 * Calculate the number of nights between two dates
 * Uses local timezone to avoid date shifting issues
 */
export function calculateBookingNights(range?: DateRange): number {
	if (!range?.start || !range?.end) return 0;

	const localTz = getLocalTimeZone();
	const startDate = range.start.toDate(localTz);
	const endDate = range.end.toDate(localTz);

	const diffTime = endDate.getTime() - startDate.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	return Math.max(0, diffDays);
}

/**
 * Calculate the booking price breakdown
 * @param input - The booking input (assumed to be valid)
 * @returns The booking price breakdown or null if data is incomplete
 */
export function calculateBookingPrice(input: BookingInput): BookingPriceBreakdown | null {
	const { dateRange, pricePerNight, discountPercentage = 0, guests } = input;

	// Return null if any required data is missing
	if (!dateRange?.start || !dateRange?.end || !guests) return null;

	const nights = calculateBookingNights(dateRange);
	if (nights === 0) return null;

	// Base price
	const basePrice = nights * pricePerNight;
	const discount = discountPercentage ? basePrice * (discountPercentage / 100) : 0;
	const discountedBasePrice = basePrice - discount;
	const cleaningFee = bookingConfig.cleaningFee;

	// Fees (in percentage)
	const serviceFee = discountedBasePrice * (bookingConfig.serviceFeePercentage / 100);
	const bookingFee = discountedBasePrice * (bookingConfig.bookingFeePercentage / 100);
	const processingFee = discountedBasePrice * (bookingConfig.processingFeePercentage / 100);

	// Subtotal and tax
	const subtotal = discountedBasePrice + cleaningFee + serviceFee + bookingFee + processingFee;
	const tax = subtotal * (bookingConfig.taxRate / 100);
	const totalPrice = subtotal + tax;

	return {
		nights,
		basePrice,
		discount,
		discountedBasePrice,
		cleaningFee,
		serviceFee,
		bookingFee,
		processingFee,
		subtotal,
		tax,
		totalPrice
	};
}
