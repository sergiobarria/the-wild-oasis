import type { DateRange } from 'bits-ui';

export interface BookingPriceBreakdown {
	nights: number;
	basePrice: number;
	discount: number;
	discountedBasePrice: number;
	cleaningFee: number;
	serviceFee: number;
	bookingFee: number;
	processingFee: number;
	subtotal: number;
	tax: number;
	totalPrice: number;
}

export interface BookingInput {
	dateRange: DateRange | undefined;
	guests: number | undefined;
	pricePerNight: number;
	discountPercentage?: number | null;
}

export interface BookingData {
	cabinId: string;
	checkIn: Date;
	checkOut: Date;
	guests: number;
	priceBreakdown: BookingPriceBreakdown;
}

export interface ValidationError {
	field: string;
	message: string;
}

export interface ValidationResult {
	isValid: boolean;
	errors: ValidationError[];
}

export interface BookingValidationInput {
	dateRange?: DateRange;
	guests?: number;
	maxGuests?: number;
	blockedDates?: Date[];
}
