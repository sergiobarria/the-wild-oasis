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

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @foreach($cabins as $cabin)
                <div
                    class="bg-base-100 border border-zinc-700/50 rounded-2xl overflow-hidden shadow-sm transition hover:shadow-lg">
                    <img src="{{ asset($cabin->image) }}" alt="{{ $cabin->name }}"
                         class="w-full h-56 object-cover"/>

                    <div class="p-6 space-y-4">
                        <div class="flex justify-between items-start">
                            <h3 class="text-xl font-semibold text-zinc-100">{{ $cabin->name }}</h3>
                            <span class="text-accent text-lg font-bold">${{ number_format($cabin->price, 2) }}<span
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
                                <x-lucide-map-pin class="size-4 text-accent"/>
                                {{ $cabin->location }}
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
    </div>
</x-layouts.app>
