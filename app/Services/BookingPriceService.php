<?php

namespace App\Services;

use App\Models\Cabin;

class BookingPriceService
{
    public static function calculate(Cabin $cabin, int $nights): array
    {
        $pricePerNight = $cabin->price_per_night;
        $subtotal = $pricePerNight * $nights;

        $bookingFee = config('booking.fees.booking');
        $processingFeeRate = config('booking.fees.processing');
        $taxRate = config('booking.fees.tax');

        $processingFee = round(($subtotal + $bookingFee) * ($processingFeeRate / 100), 2);
        $taxes = round($subtotal * ($taxRate / 100), 2);

        $total = round($subtotal + $bookingFee + $processingFee + $taxes, 2);

        return [
            'pricePerNight' => (float)$pricePerNight,
            'subtotal' => (float)$subtotal,
            'bookingFee' => (float)$bookingFee,
            'processingFee' => $processingFee,
            'taxes' => $taxes,
            'total' => $total,
        ];
    }
}
