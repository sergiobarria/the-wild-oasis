<x-layouts.app :title="'Reservation Summary'">
    <section class="max-w-4xl mx-auto px-8 py-16 space-y-10">
        <div class="space-y-2 text-center">
            <h1 class="text-3xl font-bold text-primary">Reservation Summary</h1>
            <p class="text-gray-500">Review your booking details before continuing</p>
        </div>

        <div class="bg-base-100 border border-base-300 shadow rounded-xl p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                <div>
                    <h2 class="text-xl font-semibold text-primary mb-3">Your Stay</h2>
                    <p><span class="text-base-content/70">Check-in:</span>
                        <strong>{{ $checkin->format('M j, Y') }}</strong></p>
                    <p><span class="text-base-content/70">Check-out:</span>
                        <strong>{{ $checkout->format('M j, Y') }}</strong></p>
                    <p><span class="text-base-content/70">Nights:</span> <strong>{{ $nights }}</strong></p>
                    <p><span class="text-base-content/70">Guests:</span> <strong>{{ $guests }}</strong></p>
                </div>

                <div>
                    <h2 class="text-xl font-semibold text-primary mb-3">Cabin Info</h2>
                    <p><span class="text-base-content/70">Name:</span> <strong>{{ $cabin->name }}</strong></p>
                    <p><span class="text-base-content/70">Price/night:</span>
                        <strong>${{ number_format($pricePerNight, 2) }}</strong></p>
                </div>
            </div>

            <div class="border-t border-base-300 pt-6 space-y-2">
                <h2 class="text-xl font-semibold text-primary mb-4">Price Breakdown</h2>
                @php $lines = [
                    ['Subtotal (' . $nights . ' nights)', $subtotal],
                    ['Booking Fee', $bookingFee],
                    ['Processing Fee', $processingFee],
                    ['Taxes', $taxes],
                ]; @endphp

                @foreach ($lines as [$label, $amount])
                    <div class="flex justify-between text-base">
                        <span class="text-base-content/80">{{ $label }}</span>
                        <span>${{ number_format($amount, 2) }}</span>
                    </div>
                @endforeach

                <div class="flex justify-between text-xl font-bold border-t border-base-300 pt-4">
                    <span class="text-primary">Total</span>
                    <span>${{ number_format($total, 2) }}</span>
                </div>
            </div>
        </div>

        <form method="POST" action="{{ route('checkout.store') }}" class="flex justify-center">
            @csrf

            <input type="hidden" name="dates[start]" value="{{ $checkin->toDateString() }}">
            <input type="hidden" name="dates[end]" value="{{ $checkout->toDateString() }}">
            <input type="hidden" name="guests" value="{{ $guests }}">
            <input type="hidden" name="cabinId" value="{{ $cabin->id }}">

            <flux:button type="submit" variant="primary" class="cursor-pointer">
                Continue to Checkout
            </flux:button>
        </form>
    </section>
</x-layouts.app>
