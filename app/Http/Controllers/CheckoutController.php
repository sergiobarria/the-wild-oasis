<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Services\BookingCheckoutService;

class CheckoutController extends Controller
{
    public function summary(StoreBookingRequest $request)
    {
        $data = $request->toBookingData();

        return view('checkout.summary', [
            'cabin' => $data->cabin,
            'checkin' => $data->checkin,
            'checkout' => $data->checkout,
            'guests' => $data->guests,
            'nights' => $data->nights,
            ...$data->price,
        ]);
    }

    public function store(StoreBookingRequest $request)
    {
        $data = $request->toBookingData();

        try {
            $userId = auth()->id() ?? 1; // TODO: Hardcoded for now
            $session = BookingCheckoutService::createSession($data, $userId);
        } catch (\Exception $e) {
            \Log::error($e);
            return response()->noContent();
        }

        return redirect($session->url);
    }

    public function success()
    {
        return view('checkout.success');
    }

    public function cancel()
    {
        return view('checkout.cancel');
    }
}
