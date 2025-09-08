<x-pages-layout :title="$cabin->name">
    <section class="max-w-7xl mx-auto px-8 pt-12 space-y-20 pb-16">
        <a href="{{ route('cabins.index') }}"
           class="mb-4 inline-flex items-center hover:text-accent transition-colors duration-300 ease-in-out">
            <flux:icon.arrow-left class="size-4 mr-2"/>
            <span>Return to all cabins</span>
        </a>

        {{-- Cover Image --}}
        <div class="relative h-[60vh] rounded-xl overflow-hidden shadow">
            <img src="{{ asset($cabin->getFirstMediaUrl('cabins')) }}" alt="{{ $cabin->name }}"
                 class="object-cover w-full h-full"/>
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
            <div class="absolute bottom-6 left-6 text-white">
                <flux:heading level="1" size="xl" class="text-4xl font-bold">{{ $cabin->name }}</flux:heading>
                <flux:text class="text-zinc-300 mt-2 text-base">{{ $cabin->summary }}</flux:text>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
            {{-- Left column --}}
            <div class="md:col-span-2 space-y-10 text-zinc-400 leading-relaxed">
                <div class="space-y-4">
                    <blockquote class="border-l-4 border-accent pl-4 text-lg mb-8 italic text-zinc-300">
                        “The most relaxing vacation we've had in years. We’ll be back every winter.”
                    </blockquote>

                    <h2 class="text-2xl text-zinc-100 font-semibold">Description</h2>
                    <p>{{ $cabin->description }}</p>
                </div>
            </div>

            {{-- Right column (Booking card) --}}
            <div class="self-start sticky top-6 bg-base-100 border border-zinc-700/50 rounded-xl p-6 shadow space-y-6">
                {{-- Price --}}
                <div>
                    <p class="text-zinc-400 text-sm">From</p>
                    <p class="text-3xl text-accent font-bold">
                        ${{ $cabin->price_per_night }}
                        <span class="text-base text-zinc-400 font-normal">/ night</span>
                    </p>
                </div>
            </div>
        </div>
    </section>
</x-pages-layout>
