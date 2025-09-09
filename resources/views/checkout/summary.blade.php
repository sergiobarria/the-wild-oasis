<x-pages-layout title="Checkout Summary">
    <section
        class="max-w-4xl mx-auto py-12 md:py-16 px-4 sm:px-6 lg:px-8 space-y-10 text-zinc-100">
        <div class="space-y-4 text-center">
            <flux:heading level="1" size="xl" class="font-bold text-accent">
                Your Reservation Summary
            </flux:heading>
            <flux:text class="text-zinc-400 text-lg">
                Review your booking details before continuing
            </flux:text>
        </div>

        <div
            class="bg-zinc-900 border border-zinc-700 rounded-xl p-6 md:p-8 space-y-8 shadow-2xl">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                <div>
                    <flux:heading level="2" size="xl" class="font-semibold mb-4 text-accent">
                        Cabin Details
                    </flux:heading>
                    <div class="rounded-lg overflow-hidden mb-4 shadow-md">
                        <img src="{{ $cabin->getFirstMediaUrl('cabins') ?: asset('assets/placeholder.jpg') }}"
                             alt="{{ $cabin->name }}" class="w-full h-48 object-cover"/>
                    </div>
                    <p class="text-lg font-bold text-zinc-100">{{ $cabin->name }}</p>
                    <p class="text-zinc-400 mt-1">{{ $cabin->summary }}</p>
                    <p class="text-zinc-300 mt-2">
                        <span class="font-bold text-lg">${{ number_format($cabin->price_per_night, 2) }}</span>
                        <span class="text-sm text-zinc-500"> / night</span>
                    </p>
                </div>

                <div
                    class="lg:pl-8 border-t lg:border-t-0 lg:border-l border-zinc-700 pt-8 lg:pt-0 h-full">
                    <flux:heading level="2" size="xl" class="font-semibold mb-4 text-accent">Your Stay</flux:heading>
                    <dl class="space-y-3 text-zinc-300">
                        <div class="flex justify-between items-center">
                            <dt class="font-medium flex items-center gap-2">
                                <flux:icon.calendar class="size-5 text-accent"/>
                                Check-in:
                            </dt>
                            <dd class="font-bold text-lg">{{ $checkin->format('M j, Y') }}</dd>
                        </div>
                        <div class="flex justify-between items-center">
                            <dt class="font-medium flex items-center gap-2">
                                <flux:icon.calendar-date-range class="size-5 text-accent"/>
                                Check-out:
                            </dt>
                            <dd class="font-bold text-lg">{{ $checkout->format('M j, Y') }}</dd>
                        </div>
                        <div class="flex justify-between items-center">
                            <dt class="font-medium flex items-center gap-2">
                                <flux:icon.moon class="size-5 text-accent"/>
                                Nights:
                            </dt>
                            <dd class="font-bold text-lg">{{ $nights }}</dd>
                        </div>
                        <div class="flex justify-between items-center">
                            <dt class="font-medium flex items-center gap-2">
                                <flux:icon.user-group class="size-5 text-accent"/>
                                Guests:
                            </dt>
                            <dd class="font-bold text-lg">{{ $guests }}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <flux:separator/>

            {{-- Price Breakdown --}}
            <div class="space-y-4">
                <flux:heading level="2" size="xl" class="font-bold mb-4 text-accent">Price Breakdown</flux:heading>

                <dl class="space-y-3 text-zinc-300">
                    <div class="flex justify-between">
                        <dt>Subtotal ({{ $nights }} nights):</dt>
                        <dd>${{ number_format($subtotal, 2) }}</dd>
                    </div>

                    @if ($cabin->discount_percentage && $cabin->discount_percentage > 0)
                        <div class="flex justify-between text-green-400">
                            <dt>Discount ({{ number_format($cabin->discount_percentage, 0) }}%):</dt>
                            <dd>
                                -${{ number_format($cabin->price_per_night * ($cabin->discount_percentage / 100) * $nights, 2) }}
                            </dd>
                        </div>
                    @endif

                    {{-- Booking fee --}}
                    <div class="flex justify-between">
                        <dt>Booking Fee:</dt>
                        <dd>${{ number_format($bookingFee, 2) }}</dd>
                    </div>

                    {{-- Processing Fee --}}
                    <div class="flex justify-between">
                        <span>Processing Fee:</span>
                        <span>${{ number_format($processingFee, 2) }}</span>
                    </div>

                    {{-- Taxes --}}
                    <div class="flex justify-between">
                        <dt>Taxes:</dt>
                        <dd>${{ number_format($taxes, 2) }}</dd>
                    </div>

                    <flux:separator/>

                    <div class="flex justify-between text-xl font-bold text-accent">
                        <dt>Total Due:</dt>
                        <dd>${{ number_format($totalPrice, 2) }}</dd>
                    </div>
                </dl>
            </div>

            {{-- Actions --}}
            @auth
                <form action="{{ route('checkout.store') }}" method="POST">
                    @csrf
                    <flux:button type="submit" variant="primary" class="w-full text-lg py-3">
                        Confirm Booking & Pay
                    </flux:button>
                </form>
            @else
                <div class="text-center">
                    <p class="text-zinc-300 mb-4">You need to be logged in to complete your booking.</p>
                    <flux:button
                        href="{{ route('login', ['redirect' => url()->current()]) }}"
                        variant="primary"
                        icon="calendar-date-range"
                    >
                        Login to Book
                    </flux:button>
                </div>
            @endauth
        </div>
    </section>
</x-pages-layout>
