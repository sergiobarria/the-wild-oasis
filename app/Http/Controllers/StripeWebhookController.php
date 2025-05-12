<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\CabinAvailability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Webhook;
use Throwable;

class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (Throwable $e) {
            Log::error('Stripe webhook error: ' . $e->getMessage());
            return response()->json(['error' => 'Invalid'], 400);
        }

        if ($event->type == 'checkout.session.completed') {
            Log::info('Checkout session completed event received.');
            $session = $event->data->object;
            Log::info('Stripe Webhook received session: ' . $session);

            if (Booking::where('stripe_session_id', $session->id)->exists()) {
                return response()->noContent();
            }

            // Create Booking
            Booking::create([
                'cabin_id' => $session->metadata->cabin_id,
                'user_id' => $session->metadata->user_id,
                'start_date' => $session->metadata->startDate,
                'end_date' => $session->metadata->endDate,
                'guests' => $session->metadata->guests,
                'nights' => $session->metadata->nights,
                'subtotal' => $session->metadata->subtotal,
                'booking_fee' => $session->metadata->bookingFee,
                'taxes' => $session->metadata->taxes,
                'total' => $session->metadata->total,
                'stripe_session_id' => $session->id,
            ]);

            // Update Availability
            CabinAvailability::create([
                'cabin_id' => $session->metadata->cabin_id,
                'start_date' => $session->metadata->startDate,
                'end_date' => $session->metadata->endDate,
                'is_available' => false,
            ]);
        }

        return response()->noContent();
    }
}
