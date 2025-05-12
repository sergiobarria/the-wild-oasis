<?php

namespace App\Services;

use App\Data\BookingRequestData;
use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;
use Stripe\Stripe;

class BookingCheckoutService
{
    /**
     * @param BookingRequestData $data
     * @param int|null $userId
     * @return Session
     * @throws ApiErrorException
     */
    public static function createSession(BookingRequestData $data, ?int $userId = null): Session
    {
        Stripe::setApiKey(config('services.stripe.secret_key'));

        return Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => 'Booking: ' . $data->cabin->name,
                        'description' => "From {$data->checkin->toFormattedDateString()} to {$data->checkout->toFormattedDateString()}",
                        'images' => [$data->cabin->mainImageUrl()],
                    ],
                    'unit_amount' => $data->price['total'] * 100,
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => route('checkout.success'),
            'cancel_url' => route('checkout.cancel'),
            'metadata' => [
                'cabin_id' => $data->cabin->id,
                'user_id' => $userId,
                'startDate' => $data->checkin->toDateString(),
                'endDate' => $data->checkout->toDateString(),
                'guests' => $data->guests,
                'nights' => $data->nights,
                'subtotal' => $data->price['subtotal'],
                'bookingFee' => $data->price['bookingFee'],
                'processingFee' => $data->price['processingFee'],
                'taxes' => $data->price['taxes'],
                'total' => $data->price['total'],
            ],
        ]);
    }
}
