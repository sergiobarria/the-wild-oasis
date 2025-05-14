<x-layouts.account>
    <h1 class="font-semibold text-xl text-accent tracking-wider mb-8">
        Welcome back, <span class="capitalize">{{ $user->profile->name }}</span>
    </h1>

    <div class="grid md:grid-cols-3 gap-8">
        <div class="space-y-4">
            <div class="bg-zinc-800 p-4 rounded-xl shadow">
                <p class="text-sm text-zinc-500">Total bookings</p>
                <p class="text-xl font-bold text-white">{{ $stats['total_bookings'] }}</p>
            </div>
            <div class="bg-zinc-800 p-4 rounded-xl shadow">
                <p class="text-sm text-zinc-500">Nights stayed</p>
                <p class="text-xl font-bold text-white">{{ $stats['total_nights'] }}</p>
            </div>
            <div class="bg-zinc-800 p-4 rounded-xl shadow">
                <p class="text-sm text-zinc-500">Total guests</p>
                <p class="text-xl font-bold text-white">{{ $stats['total_guests'] }}</p>
            </div>
            <div class="bg-zinc-800 p-4 rounded-xl shadow">
                <p class="text-sm text-zinc-500">Member since</p>
                <p class="text-xl font-bold text-white">{{ $stats['member_since']->format('M Y') }}</p>
            </div>
        </div>

        {{-- Detalle y próxima reserva (derecha, 2/3) --}}
        <div class="md:col-span-2 space-y-6">
            @if ($stats['next_booking'])
                <div class="bg-gradient-to-br from-accent to-primary/90 text-white p-6 rounded-xl shadow-lg">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <p class="text-sm text-white/70 uppercase">Next stay</p>
                            <p class="text-2xl font-semibold">{{ $stats['next_booking']->cabin->name }}</p>
                            <p class="text-white/70 text-sm">
                                {{ \Carbon\Carbon::parse($stats['next_booking']->start_date)->format('M j') }}
                                –{{ \Carbon\Carbon::parse($stats['next_booking']->end_date)->format('j, Y') }}
                            </p>
                        </div>

                        <a href="{{ route('account.reservations') }}"
                           class="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-medium hover:underline">
                            View all reservations
                            <x-lucide-arrow-right class="size-4"/>
                        </a>
                    </div>
                </div>
            @endif

            <div class="bg-zinc-800 p-6 rounded-xl shadow grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <p class="text-sm text-zinc-500">Total spent</p>
                    <p class="text-xl font-bold text-white">${{ number_format($stats['total_spent'], 2) }}</p>
                </div>
                <div>
                    <p class="text-sm text-zinc-500">Total guests hosted</p>
                    <p class="text-xl font-bold text-white">{{ $stats['total_guests'] }}</p>
                </div>
            </div>
        </div>
    </div>
</x-layouts.account>
