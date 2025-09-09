<?php

namespace App\Services;

use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Validation\ValidationException;

class BookingCheckoutService
{
    private float $taxRate;
    private float $bookingFeePercentage;
    private float $processingFeePercentage;

    public function __construct()
    {
        $this->taxRate = config('booking.tax_rate');
        $this->bookingFeePercentage = config('booking.booking_fee_percentage');
        $this->processingFeePercentage = config('booking.processing_fee_percentage');
    }

    /**
     * Calculate price details for a booking
     *
     * @param object $bookingData : cabin, checkin, checkout, guests, nights
     * @return array subtotal, booking_fee, taxes, totalPrice
     */
    public function calculatePrice(object $bookingData): array
    {
        $cabin = $bookingData->cabin;
        $nights = $bookingData->nights;

        if ($nights <= 0) {
            throw new \InvalidArgumentException('Number of nights must be greater than 0.');
        }

        $pricePerNightAfterDiscount = $cabin->price_per_night * (1 - ($cabin->discount_percentage / 100));
        $subtotal = $pricePerNightAfterDiscount * $nights;

        $bookingFee = $subtotal * ($this->bookingFeePercentage / 100);
        $taxableAmount = $subtotal + $bookingFee;
        $taxes = $taxableAmount * ($this->taxRate / 100);

        $totalBeforeProcessingFee = $subtotal + $bookingFee + $taxes;
        $processingFee = $totalBeforeProcessingFee * ($this->processingFeePercentage / 100);

        $total = $totalBeforeProcessingFee + $processingFee;

        return [
            'subtotal' => round($subtotal, 2),
            'booking_fee' => round($bookingFee, 2),
            'taxes' => round($taxes, 2),
            'processing_fee' => round($processingFee, 2),
            'total_price' => round($total, 2),
        ];
    }

    /**
     * Validates the booking request against business rules.
     * Throws a ValidationException if there is any issue.
     *
     * @param object $bookingData Contains: cabin, checkin (Carbon), checkout (Carbon), guests, nights
     * @param array $unavailableDatesArray Array of blocked dates
     * @throws ValidationException
     */
    public function validateBookingRequest(object $bookingData, array $unavailableDatesArray): void
    {
        $cabin = $bookingData->cabin;
        $checkin = $bookingData->checkin;
        $checkout = $bookingData->checkout;
        $guests = $bookingData->guests;
        $nights = $bookingData->nights;

        $errors = [];

        // 1. Validate dates and guests
        if ($guests <= 0 || $guests > $cabin->max_guests) {
            $errors['guests'] = 'Number of guests i invalid or exceeds cabin capacity (Max ' . $cabin->max_guests . ' guests)';
        }
        if ($checkin->isBefore(Carbon::today())) {
            $errors['range'] = 'Check-in date cannot be in the past.';
        }
        if ($checkout->lessThanOrEqualTo($checkin)) {
            $errors['range'] = 'Check-out date must be after check-in.';
        }
        if ($nights <= 0) {
            $errors['nights'] = 'Number of nights must be greater than 0.';
        }

        // 2. Verify dates availability
        $periodToCheck = CarbonPeriod::create($checkin, $checkout->copy()->subDay());
        foreach ($periodToCheck as $date) {
            if (in_array($date->toDateString(), $unavailableDatesArray)) {
                $errors['range'] = 'One or more selected dates are unavailable. Please review the calendar.';
                break;
            }
        }

        if (!empty($errors)) {
            throw ValidationException::withMessages($errors);
        }
    }
}
