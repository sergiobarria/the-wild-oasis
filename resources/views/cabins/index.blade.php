<x-layouts.app title="Cabins">
    <div class="max-w-7xl container mx-auto px-8 py-12">
        <h1 class="mb-4 text-4xl font-medium text-accent">Our Luxury Cabins</h1>
        <p class="text-lg mb-10">
            Cozy yet luxurious cabins, located right at the heart of the Italian Dolomites. Imagine waking up to
            beautiful mountain views,
            spending your days exploring the dark forests around, or just relaxing in your private hot tub under the
            stars.
            Enjoy nature's beauty in your own little home away from home. The perfect spot for a peaceful, calm
            vacation. Welcome to paradise.
        </p>

        <form method="GET" action="{{ route('cabins.index') }}" class="flex items-start gap-2 justify-between">
            <div class="relative w-full">
                <flux:input type="string" name="q" icon="magnifying-glass" :value="request('q')" class="w-full"/>

                @if(request()->has('q'))
                    <a
                        href="{{ route('cabins.index') }}"
                        class="absolute inset-y-0 right-2 flex items-center justify-center text-zinc-400 hover:text-accent transition"
                        aria-label="Clear search"
                    >
                        <x-lucide-x class="size-4"/>
                    </a>
                @endif

            </div>
            <flux:button type="submit" variant="primary" class="cursor-pointer">Search</flux:button>
        </form>
        <p class="mt-2 mb-8  text-sm">Results: {{ count($cabins) }}</p>

        @if(count($cabins) == 0 && request()->query('q'))
            <p class="text-center text-zinc-400">No results for your search: {{ request()->query('q') }}</p>
        @elseif (count($cabins) > 0)
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                @foreach($cabins as $cabin)
                    <div
                        class="bg-base-100 border border-zinc-700/50 rounded-2xl overflow-hidden shadow-sm transition hover:shadow-lg">
                        <img src="{{ asset($cabin->mainImageUrl()) }}" alt="{{ $cabin->name }}"
                             class="w-full h-56 object-cover"/>

                        <div class="p-6 space-y-4">
                            <div class="flex justify-between items-start">
                                <h3 class="text-xl font-semibold text-zinc-100">{{ $cabin->name }}</h3>
                                <span class="text-accent text-lg font-bold">${{ number_format($cabin->price_per_night, 2) }}<span
                                        class="text-sm text-zinc-400">/night</span></span>
                            </div>

                            <p class="text-zinc-400 text-sm leading-relaxed">
                                {{ $cabin->summary }}
                            </p>

                            <ul class="flex gap-6 text-zinc-400 text-sm">
                                <li class="flex items-center gap-1">
                                    <x-lucide-bed class="size-4 text-accent"/>
                                    {{ $cabin->num_beds }} Beds
                                </li>
                                <li class="flex items-center gap-1">
                                    <x-lucide-users class="size-4 text-accent"/>
                                    Sleeps {{ $cabin->capacity }}
                                </li>
                                <li class="flex items-center gap-1">
                                    <x-lucide-users-2 class="size-4 text-accent"/>
                                    Max {{ $cabin->max_guests }} guests
                                </li>
                            </ul>

                            <div class="pt-4">
                                <a
                                    href="{{ route('cabins.show', ['slug' => $cabin->slug]) }}"
                                    class="inline-block bg-accent text-accent-foreground px-4 py-2 text-sm font-medium rounded hover:bg-accent-content transition"
                                >
                                    View Details
                                </a>
                            </div>
                        </div>
                    </div>

                @endforeach
            </div>
        @endif
    </div>
</x-layouts.app>
