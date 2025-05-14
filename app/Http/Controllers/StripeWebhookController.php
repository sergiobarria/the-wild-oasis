<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\CabinAvailability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\Charge;
use Stripe\Exception\ApiErrorException;
use Stripe\PaymentIntent;
use Stripe\Stripe;
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

            // Get Payment Receipt
            Stripe::setApiKey(config('services.stripe.secret_key'));

            $receiptUrl = null;
            try {
                $paymentIntent = PaymentIntent::retrieve($session->payment_intent);
                Log::info('Stripe Webhook received payment intent: ' . $paymentIntent);
                $charge = Charge::retrieve($paymentIntent->latest_charge);
                Log::info('Stripe Webhook received charge: ' . $charge);
                $receiptUrl = $charge?->receipt_url;
            } catch (ApiErrorException $e) {
                \Log::error('Stripe webhook error: ' . $e->getMessage());
            }

            Log::info('Stripe Webhook received receipt: ' . $receiptUrl);

            try {
                DB::beginTransaction();

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
                    'receipt_url' => $receiptUrl,
                ]);

                // Update Availability
                CabinAvailability::create([
                    'cabin_id' => $session->metadata->cabin_id,
                    'start_date' => $session->metadata->startDate,
                    'end_date' => $session->metadata->endDate,
                    'is_available' => false,
                ]);

                DB::commit();
            } catch (\Throwable $e) {
                DB::rollBack();
                Log::error('Stripe webhook DB transaction failed: ' . $e->getMessage());
                return response()->json(['error' => 'Internal error'], 500);
            }
        }

        return response()->noContent();
    }
}
