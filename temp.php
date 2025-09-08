<?php

<x-layouts.app :title="$cabin->name">
    <section class="max-w-7xl mx-auto px-8 pt-12 space-y-20">
        <a href="{{ route('cabins.index') }}"
           class="mb-4 inline-flex items-center hover:text-accent transition-colors duration-300 ease-in-out">
            <x-lucide-arrow-left-circle class="size-8 mr-2"/>
            <span>Return to all cabins</span>
        </a>

        {{-- Cover Image --}}
        <div class="relative h-[60vh] rounded-xl overflow-hidden shadow">
            <img src="{{ asset($cabin->mainImageUrl()) }}" alt="{{ $cabin->name }}"
                 class="object-cover w-full h-full"/>
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
            <div class="absolute bottom-6 left-6 text-white">
                <h1 class="text-4xl font-bold">{{ $cabin->name }}</h1>
                <p class="text-zinc-300 mt-2">{{ $cabin->summary }}</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
            {{-- Left Column --}}
            <div class="md:col-span-2 space-y-10 text-zinc-400 leading-relaxed">

                {{-- Description + Testimonial --}}
                <div class="space-y-4">
                    <blockquote class="border-l-4 border-accent pl-4 text-lg mb-8 italic text-zinc-300">
“The most relaxing vacation we've had in years. We’ll be back every winter.”
                    </blockquote>

                    <h2 class="text-2xl text-zinc-100 font-semibold">Description</h2>
                    <p>{{ $cabin->description }}</p>
                </div>

                {{-- Tags --}}
                <div class="space-y-2 text-sm">
                    <p>🌿 Perfect for couples seeking peace & nature</p>
                    <p>🔥 Great for winter retreats with fireplace & hot tub</p>
                    <p>👨‍👩‍👧 Ideal for families (max {{ $cabin->capacity }} guests)</p>
                </div>

                {{-- Amenities --}}
                <div>
                    <h3 class="text-lg text-zinc-100 font-medium mb-4">Amenities</h3>
                    <ul class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                        @foreach($cabin->amenities as $amenity)
                            <li class="flex items-center gap-2">
                                <x-lucide-check class="text-accent size-4"/>
                                {{ $amenity['name'] }}
                            </li>
                        @endforeach
                    </ul>
                </div>

                {{-- Gallery --}}
                @if($cabin->gallery && count($cabin->gallery))
                    {{-- Galería con modal expandible --}}
                    <div x-data="{ show: false, image: '' }">
                        <h3 class="text-lg text-zinc-100 font-medium mb-6">Gallery</h3>

                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            @foreach($cabin->gallery as $image)
                                <img
                                    src="{{ asset($image) }}"
                                    alt="{{ $cabin->name }} photo"
                                    class="rounded-lg object-cover h-48 w-full cursor-pointer hover:brightness-110 transition"
                                    @click="show = true; image = '{{ asset($image) }}'"
                                />
                            @endforeach
                        </div>

                        {{-- Modal de imagen expandida --}}
                        <div
                            x-show="show"
                            x-transition
                            x-cloak
                            @keydown.escape.window="show = false"
                            class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur"
                        >
                            <div @click.outside="show = false" class="max-w-4xl w-full px-4 relative">
                                <img :src="image" alt="Expanded image"
                                     class="rounded-lg shadow-xl mx-auto max-h-[90vh]"/>
                                <button
                                    @click="show = false"
                                    class="absolute top-5 cursor-pointer right-10 text-zinc-300 hover:text-white text-3xl font-bold"
                                    aria-label="Close"
                                >
                                    <x-lucide-x-circle class="size-10"/>
                                </button>
                            </div>
                        </div>
                    </div>
                @endif

                {{-- Reviews --}}
                @if($cabin->reviews && count($cabin->reviews))
                    <div class="space-y-8">
                        <h3 class="text-lg text-zinc-100 font-medium">Guest Reviews</h3>

                        @foreach($cabin->reviews as $review)
                            <div class="border border-zinc-700/40 rounded-xl p-6 bg-base-100">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="text-zinc-100 font-semibold">{{ $review['author_name'] }}</div>
                                    <div class="flex items-center gap-1 text-yellow-400">
                                        @for($i = 1; $i <= 5; $i++)
                                            <x-lucide-star
                                                class="size-4 {{ $i <= $review['rating'] ? 'text-yellow-400' : 'text-zinc-600' }}"/>
                                        @endfor
                                    </div>
                                </div>
                                <p class="text-zinc-400 text-sm">{{ $review['comment'] }}</p>
                                <p class="text-zinc-500 text-xs mt-2">{{ $review->formatted_date }}</p>
                            </div>
                        @endforeach
                    </div>
                @endif

                {{-- Policies --}}
                <div class="pt-12 border-t border-zinc-700/30">
                    <h3 class="text-lg text-zinc-100 font-medium mb-4">Good to know</h3>
                    <div class="text-sm text-zinc-400 space-y-2">
                        <p>🕒 Check-in: 3:00 PM – Check-out: 11:00 AM</p>
                        <p>❌ No smoking inside. Pets allowed on request.</p>
                        <p>💳 Full refund if cancelled 7+ days before check-in.</p>
                    </div>
                </div>

            </div>

            {{-- Right Column (Booking Card) --}}
            <div class="self-start sticky top-6 bg-base-100 border border-zinc-700/50 rounded-xl p-6 shadow space-y-6">
                {{-- Price --}}
                <div>
                    <p class="text-zinc-400 text-sm">From</p>
                    <p class="text-3xl text-accent font-bold">
                        ${{ $cabin->price_per_night }}
                        <span class="text-base text-zinc-400 font-normal">/ night</span>
                    </p>
                </div>

                {{-- Rating --}}
                <div class="flex items-center gap-2 text-sm text-zinc-400">
                    <x-lucide-star class="size-4 text-yellow-400"/>
                    <span class="text-zinc-100 font-medium">{{ $cabin->getRatingAttribute() }}</span>
                    <span>({{ $cabin->reviews_count }} reviews)</span>
                </div>

                {{-- Specifications --}}
                <ul class="text-sm flex items-center justify-between gap-4 text-zinc-400">
                    <li class="flex flex-col justify-center items-center gap-2">
                        <x-lucide-bath class="size-4 text-accent"/>
                        {{ $cabin->bathrooms }} {{ \Illuminate\Support\Str::plural('bathrooms', $cabin->bathrooms) }}
                    </li>
                    <li class="flex flex-col justify-center items-center gap-2">
                        <x-lucide-bed class="size-4 text-accent"/>
                        {{ $cabin->bedrooms }} {{ \Illuminate\Support\Str::plural('bed', $cabin->bedrooms) }}
                    </li>
                    <li class="flex flex-col justify-center items-center gap-2">
                        <x-lucide-users-2 class="size-4 text-accent"/>
                        Max {{ $cabin->max_guests }} guests
                    </li>
                </ul>

                <hr class="border-zinc-800"/>

                @if ($errors->any())
                    <div class="p-4 mb-4 rounded-lg border border-red-600/30 bg-red-900/20 text-red-300 space-y-2">
                        <p class="font-semibold text-red-400">There were some problems with your submission:</p>
                        <ul class="list-disc list-inside text-sm space-y-1">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <form method="GET" action="{{ route('checkout.summary') }}" class="space-y-6">
                    <input type="hidden" name="cabinId" value="{{ $cabin->id }}"/>

                    <flux:field>
                        <flux:label>Pick your Dates</flux:label>
                        <div class="bg-zinc-800 rounded-lg">
                            <flux:calendar
                                name="dates"
                                :selectable-header="true"
                                size="xs"
                                mode="range"
                                months="1"
                                min="today"
                                unavailable="{{ $cabin->unavailable_dates }}"
                            />
                        </div>
                        <flux:error name="range"/>
                    </flux:field>

                    <flux:field>
                        <flux:label>Number of Guests</flux:label>
                        <flux:input name="guests" type="number" value="{{ old('guests', 2) }}"/>
                        <flux:error name="guests"/>
                    </flux:field>

                    <flux:button type="submit" variant="primary" spinner="submit" class="cursor-pointer w-full">
                        Book this cabin
                    </flux:button>
                </form>
            </div>
        </div>
    </section>

    @if($recommendedCabins && count($recommendedCabins))
        <section class="max-w-7xl mx-auto px-8 py-20 space-y-10">
            <h2 class="text-2xl font-semibold text-zinc-100">Other Cabins You Might Like</h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                @foreach($recommendedCabins as $cabin)
                    <div
                        class="bg-base-100 border border-zinc-700/40 rounded-xl overflow-hidden shadow hover:shadow-lg transition">
                        <img src="{{ asset($cabin->mainImageUrl()) }}" alt="{{ $cabin->name }}"
                             class="w-full h-48 object-cover"/>

                        <div class="p-5 space-y-3">
                            <h3 class="text-lg font-semibold text-zinc-100">{{ $cabin->name }}</h3>

                            <div class="text-zinc-100 font-medium">
                                ${{ $cabin->price_per_night }} <span class="text-sm text-zinc-400">/ night</span>
                            </div>

                            <ul class="flex gap-6 text-zinc-400 text-sm">
                                <li class="flex items-center gap-1">
                                    <x-lucide-bed class="size-4 text-accent"/>
                                    {{ $cabin->bedrooms }} Beds
                                </li>
                                <li class="flex items-center gap-1">
                                    <x-lucide-bath class="size-4 text-accent"/>
                                    {{ $cabin->bathrooms }} Bathrooms
                                </li>
                                <li class="flex items-center gap-1">
                                    <x-lucide-users-2 class="size-4 text-accent"/>
                                    Max {{ $cabin->max_guests }} guests
                                </li>
                            </ul>

                            <div class="pt-2">
                                <a
                                    href="{{ route('cabins.show', $cabin->slug) }}"
                                    class="inline-flex items-center gap-1 text-accent hover:text-accent-content text-sm font-medium transition"
                                >
                                    View Details
                                    <x-lucide-arrow-right class="size-4 ml-2"/>
                                </a>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        </section>
    @endif
</x-layouts.app>
