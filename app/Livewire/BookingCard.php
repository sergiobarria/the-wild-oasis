<?php

namespace App\Livewire;

use App\Models\Cabin;
use App\Services\BookingCheckoutService;
use Flux\DateRange;
use Flux\Flux;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;
use Livewire\Attributes\Computed;
use Livewire\Attributes\Validate;
use Livewire\Component;

class BookingCard extends Component
{
    public Cabin $cabin;

    #[Validate('required')]
    public DateRange $range;

    #[Validate('required|integer|min:1')]
    public int $guests = 2;

    public ?int $nights = null;
    public ?float $totalPrice = null;
    public ?float $subtotal = null;
    public ?float $taxes = null;
    public ?float $bookingFee = null;
    public ?float $processingFee = null;

    protected BookingCheckoutService $bookingCheckoutService;

    public function boot(BookingCheckoutService $bookingCheckoutService): void
    {
        $this->bookingCheckoutService = $bookingCheckoutService;
    }

    public function mount(): void
    {
        $this->range = new DateRange(now(), now()->addDays(7));
        $this->guests = min($this->guests, $this->cabin->max_guests);
        $this->calculateBookingDetails();
    }

    public function calculateBookingDetails(): void
    {
        $this->resetErrorBag();
        $this->resetBookingCalculations();

        // Basic validations
        if ($this->guests > $this->cabin->max_guests) {
            $this->addError('guests', 'Number of guests exceeds cabin capacity (Max ' . $this->cabin->max_guests . ')');
            return;
        }
        if (!$this->range->start() || !$this->range->end()) {
            $this->addError('range', 'Please select both a check-in and a check-out date.');
            return;
        }

        $checkin = $this->range->start();
        $checkout = $this->range->end();
        if ($checkout->lessThanOrEqualTo($checkin)) {
            $this->addError('range', 'Check-out date must be after check-in date.');
            return;
        }

        $this->nights = $this->range->count();

        try {
            $bookingData = (object)[
                'cabin' => $this->cabin,
                'checkin' => $checkin,
                'checkout' => $checkout,
                'nights' => $this->nights,
                'guests' => $this->guests,
            ];

            $this->bookingCheckoutService->validateBookingRequest($bookingData, $this->unavailableDates);
            $priceDetails = $this->bookingCheckoutService->calculatePrice($bookingData);

            $this->subtotal = $priceDetails['subtotal'];
            $this->taxes = $priceDetails['taxes'];
            $this->totalPrice = $priceDetails['total_price'];
            $this->bookingFee = $priceDetails['booking_fee'];
            $this->processingFee = $priceDetails['processing_fee'];

        } catch (ValidationException $e) {
            \Log::error($e->getMessage());
            foreach ($e->errors() as $field => $message) {
                \Log::error($message);
                foreach ($message as $msg) {
                    $this->addError($field, $msg);
                }
            }
        } catch (\Exception $e) {
            $this->addError('general', $e->getMessage());
            \Log::error('Booking calculation error: ' . $e->getMessage(), [
                'cabinId' => $this->cabin->id,
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    protected function resetBookingCalculations(): void
    {
        $this->nights = null;
        $this->subtotal = null;
        $this->bookingFee = null;
        $this->taxes = null;
        $this->totalPrice = null;
    }

    #[Computed]
    public function unavailableDates(): array
    {
        $datesString = $this->cabin->unavailable_dates;
        return empty($datesString) ? [] : explode(',', $datesString);
    }

    public function updated($propertyName): void
    {
        $this->validateOnly($propertyName);
        $this->calculateBookingDetails();
    }

    public function book(): void
    {
        $this->resetErrorBag();
        $this->validate();

        $this->calculateBookingDetails();

        if ($this->getErrorBag()->isNotEmpty() || $this->totalPrice === null) {
            \Log::error($this->getErrorBag());
            Flux::toast(text: 'Please correct the booking details before proceeding.', heading: 'Oops!', variant: 'warning');
            $this->redirect(url()->previous(), navigate: true);
        }

        // Prepare data for the CheckoutController
        $preBookingData = [
            'cabin_id' => $this->cabin->id,
            'cabin_name' => $this->cabin->name,
            'checkin_date' => $this->range->start()->toDateString(),
            'checkout_date' => $this->range->end()->toDateString(),
            'guests' => $this->guests,
            'nights' => $this->nights,
            'subtotal' => $this->subtotal,
            'booking_fee' => $this->bookingFee,
            'processing_fee' => $this->processingFee,
            'taxes' => $this->taxes,
            'total_price' => $this->totalPrice,
        ];

        session()->put('booking_pre_checkout_data', $preBookingData);

        $this->redirect(route('checkout.summary'), navigate: true);
    }

    public function render(): View
    {
        return view('livewire.booking-card');
    }
}
