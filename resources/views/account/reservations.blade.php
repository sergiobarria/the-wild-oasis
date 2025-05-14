<x-layouts.account>
    <h1 class="font-semibold text-xl text-accent tracking-wider">Your Reservations</h1>

    @if(count($reservations) > 0)
        <p>Below is a list of your booking history</p>

        <flux:table class="mt-4">
            <flux:table.columns>
                <flux:table.column>Cabin</flux:table.column>
                <flux:table.column>Stay Dates</flux:table.column>
                <flux:table.column>Guests</flux:table.column>
                <flux:table.column>Nights</flux:table.column>
                <flux:table.column>Total</flux:table.column>
                <flux:table.column>Booked On</flux:table.column>
                <flux:table.column>Receipt</flux:table.column>
            </flux:table.columns>

            <flux:table.rows>
                @foreach($reservations as $booking)
                    <flux:table.row>
                        <flux:table.cell>
                            <div class="flex items-center gap-3">
                                <img
                                    src="{{ asset($booking->cabin->mainImageUrl() ?? 'images/cabins/placeholder.jpg') }}"
                                    alt="{{ $booking->cabin->name }}"
                                    class="size-12 rounded-md object-cover"
                                />
                            </div>
                        </flux:table.cell>

                        <flux:table.cell>
                            <span class="text-sm">
                                {{ \Carbon\Carbon::parse($booking->start_date)->format('M j, Y') }} -
                                {{ \Carbon\Carbon::parse($booking->end_date)->format('M j, Y') }}
                            </span>
                        </flux:table.cell>

                        <flux:table.cell>{{ number_format($booking->guests, 2) }}</flux:table.cell>
                        <flux:table.cell>{{ number_format($booking->nights, 2) }}</flux:table.cell>
                        <flux:table.cell variant="strong">${{ number_format($booking->total, 2) }}</flux:table.cell>
                        <flux:table.cell>{{ \Carbon\Carbon::parse($booking->created_at)->format('M j, Y') }}</flux:table.cell>
                        <flux:table.cell>
                            @if ($booking->receipt_url)
                                <a href="{{ $booking->receipt_url }}" target="_blank" rel="noopener noreferrer"
                                   class="text-accent hover:underline text-sm">
                                    View Receipt
                                </a>
                            @else
                                <span class="text-zinc-400 text-sm">Unavailable</span>
                            @endif
                        </flux:table.cell>
                    </flux:table.row>
                @endforeach
            </flux:table.rows>
        </flux:table>
    @else
        <p>
            You have no reservations yet. Checkout our
            <a href="#" class="inline-flex gap-1 items-center text-accent hover:underline underline-offset-2">
                luxury cabins
                <x-lucide-arrow-right class="size-4 -rotate-45"/>
            </a>
        </p>
    @endif
</x-layouts.account>
