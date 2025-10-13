import { CalendarDate, getLocalTimeZone } from '@internationalized/date';
import type { DateRange } from 'bits-ui';

export interface CabinDetails {
	pricePerNight: number;
	discountPercentage: number | null;
	maxGuests: number;
}

export interface BookingFees {
	taxRate: number;
	bookingFeePercentage: number;
	processingFeePercentage: number;
	cleaningFee: number;
	serviceFeePercentage: number;
}

export class BookingPrice {
	dateRange = $state<DateRange | undefined>();
	guests = $state<number>(1);
	cabinDetails = $state<CabinDetails>();
	fees = $state<BookingFees>();
	// unavailableDates = $state<CalendarDate[]>([]);

	constructor(cabinDetails: CabinDetails, fees: BookingFees) {
		this.cabinDetails = cabinDetails;
		this.fees = fees;
	}

	// Calculate min number of nights
	nights = $derived.by(() => {
		if (!this.dateRange?.start || !this.dateRange?.end) return 0;

		const start = this.dateRange.start.toDate(getLocalTimeZone());
		const end = this.dateRange.end.toDate(getLocalTimeZone());

		const diffTime = Math.abs(end.getTime() - start.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		return Math.max(0, diffDays); // Ensure it's at least 0
	});

	// Calculate price per night after discount
	pricePerNightAfterDiscount = $derived.by(() => {
		if (!this.cabinDetails) return 0;

		const discount = this.cabinDetails.discountPercentage ?? 0;
		return this.cabinDetails.pricePerNight * (1 - discount / 100);
	});

	// Subtotal (price with discount * nights)
	subtotal = $derived(this.pricePerNightAfterDiscount * this.nights);

	// Cleaning fee (one-time)
	cleaningFee = $derived.by(() => {
		if (!this.fees || this.nights === 0) return 0;
		return this.fees.cleaningFee;
	});

	// Service fee (percentage of subtotal)
	serviceFee = $derived.by(() => {
		if (!this.fees) return 0;
		return this.subtotal * (this.fees.serviceFeePercentage / 100);
	});

	// Booking fee (percentage of subtotal)
	bookingFee = $derived.by(() => {
		if (!this.fees) return 0;
		return this.subtotal * (this.fees.bookingFeePercentage / 100);
	});

	// Taxable amount (subtotal + fees before taxes)
	taxableAmount = $derived(this.subtotal + this.cleaningFee + this.serviceFee + this.bookingFee);

	// Taxes (percentage of taxable amount)
	taxes = $derived.by(() => {
		if (!this.fees) return 0;
		return this.taxableAmount * (this.fees.taxRate / 100);
	});

	// Total before processing fee
	totalBeforeProcessingFee = $derived(this.taxableAmount + this.taxes);

	// Processing fee (percentage of total before processing fee)
	processingFee = $derived.by(() => {
		if (!this.fees) return 0;
		return this.totalBeforeProcessingFee * (this.fees.processingFeePercentage / 100);
	});

	// Total price
	totalPrice = $derived(this.totalBeforeProcessingFee + this.processingFee);

	// Discount amount (for showing the savings)
	discountAmount = $derived.by(() => {
		if (!this.cabinDetails || this.cabinDetails.discountPercentage === 0) return 0;
		const originalPrice = this.cabinDetails.pricePerNight * this.nights;
		return originalPrice - this.subtotal;
	});

	// TODO Verify if any selected date is blocked
	// ...

	// Check-in cannot be in the past
	isCheckinInPast = $derived.by(() => {
		if (!this.dateRange?.start) return false;
		const today = new CalendarDate(
			new Date().getFullYear(),
			new Date().getMonth() + 1,
			new Date().getDate()
		);
		return this.dateRange.start.compare(today) < 0;
	});

	// Validations
	isValid = $derived.by(() => {
		return (
			this.nights > 0 &&
			this.guests >= 1 &&
			this.guests <= (this.cabinDetails?.maxGuests ?? 0) &&
			// !this.hasUnavailableDates &&
			!this.isCheckinInPast
		);
	});

	// Error messages
	errors = $derived.by(() => {
		const errors: string[] = [];

		if (this.isCheckinInPast) {
			errors.push('Check-in date cannot be in the past');
		}

		if (this.nights <= 0 && this.dateRange?.start && this.dateRange?.end) {
			errors.push('Check-out date must be after check-in');
		}

		if (this.guests > (this.cabinDetails?.maxGuests ?? 0)) {
			errors.push(
				`Number of guests exceeds cabin capacity (Max ${this.cabinDetails?.maxGuests} guests)`
			);
		}

		if (this.guests < 1) {
			errors.push('At least 1 guest is required');
		}

		// if (this.hasUnavailableDates) {
		//     errors.push('One or more selected dates are unavailable');
		// }

		return errors;
	});

	// Helper to format prices
	formatPrice(value: number): string {
		return value.toFixed(2);
	}
}
