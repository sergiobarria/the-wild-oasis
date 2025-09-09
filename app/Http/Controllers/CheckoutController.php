<?php

namespace App\Http\Controllers;

use App\Models\Cabin;
use App\Services\BookingCheckoutService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    protected BookingCheckoutService $bookingCheckoutService;

    public function __construct(BookingCheckoutService $bookingCheckoutService)
    {
        $this->bookingCheckoutService = $bookingCheckoutService;
    }

    public function summary(Request $request)
    {
        $preBookingData = session()->get('booking_pre_checkout_data');
        if (!$preBookingData) {
            return redirect()->route('cabins.index');
        }

        ds($preBookingData);

        try {
            $cabin = Cabin::with(['bookings', 'availabilities'])->findOrFail($preBookingData['cabin_id']);

            $checkin = Carbon::parse($preBookingData['checkin_date']);
            $checkout = Carbon::parse($preBookingData['checkout_date']);
            $guests = $preBookingData['guests'];
            $nights = $preBookingData['nights'];

            $bookingDataForService = (object)[
                'cabin' => $cabin,
                'checkin' => $checkin,
                'checkout' => $checkout,
                'nights' => $nights,
                'guests' => $guests,
            ];

            $unavailableDatesArray = explode(',', $cabin->unavailable_dates);
            $this->bookingCheckoutService->validateBookingRequest($bookingDataForService, $unavailableDatesArray);

            $priceDetails = $this->bookingCheckoutService->calculatePrice($bookingDataForService);
            ds($priceDetails);

            $bookingDetails = array_merge($preBookingData, [
                'cabin' => $cabin,
                'subtotal' => $priceDetails['subtotal'],
                'taxes' => $priceDetails['taxes'],
                'total_price' => $priceDetails['total_price'],
                'booking_fee' => $priceDetails['booking_fee'],
                'processing_fee' => $priceDetails['processing_fee'],
            ]);
            ds($bookingDetails);

            session()->put('booking_pre_checkout_data', $bookingDetails);
        } catch (\Exception $e) {
            \Log::error('Checkout summary validation failed: ' . $e->getMessage(), ['bookingData' => $preBookingData]);
            session()->forget('booking_pre_checkout_data');

            $cabinSlug = $preBookingData['cabin_slug'] ?? ($cabin->slug ?? 'cabins');
            return redirect()->route('cabins.show', $cabinSlug);
        }

        return view('checkout.summary', [
            'cabin' => $bookingDetails['cabin'],
            'checkin' => $checkin,
            'checkout' => $checkout,
            'guests' => $bookingDetails['guests'],
            'nights' => $bookingDetails['nights'],
            'subtotal' => $bookingDetails['subtotal'],
            'taxes' => $bookingDetails['taxes'],
            'bookingFee' => $bookingDetails['booking_fee'],
            'processingFee' => $bookingDetails['processing_fee'],
            'totalPrice' => $bookingDetails['total_price'],
        ]);
    }

    public function store()
    {
        // ...
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
