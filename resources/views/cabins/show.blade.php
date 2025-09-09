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

                    <flux:heading level="2" size="xl" class=" text-zinc-100 font-semibold">Description
                    </flux:heading>
                    <flux:text class="text-base">{{ $cabin->description }}</flux:text>
                </div>

                {{-- Tags --}}
                <div class="space-y-2 text-sm">
                    <p>🌿 Perfect for couples seeking peace & nature</p>
                    <p>🔥 Great for winter retreats with fireplace & hot tub</p>
                    <p>👨‍👩‍👧 Ideal for families (max {{ $cabin->max_guests }} guests)</p>
                </div>

                <div class="space-y-4">
                    <flux:heading level="2" size="xl" class=" text-zinc-100 font-semibold">
                        Amenities
                    </flux:heading>
                    <ul class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                        @foreach($cabin->amenities as $amenity)
                            <li class="flex items-center gap-2">
                                <flux:icon.check class="text-accent size-4"/>
                                {{ $amenity['name'] }}
                            </li>
                        @endforeach
                    </ul>
                </div>

                <div class="space-y-4">
                    <flux:heading level="2" size="xl" class=" text-zinc-100 font-semibold">
                        Image Gallery
                    </flux:heading>

                    @php
                        $gallery = $cabin->getMedia('cabins');
                    @endphp

                    @if($gallery->isNotEmpty())
                        <div x-data="{ show: false, image: '' }">
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                @foreach($gallery as $image)
                                    <img
                                        src="{{ $image->getUrl() }}"
                                        alt="{{ $cabin->name }}"
                                        class="rounded-lg object-cover w-full h-48 cursor-pointer hover:brightness-110 transition"
                                        @click="show = true; image = '{{ $image->getUrl() }}'"
                                    />
                                @endforeach
                            </div>

                            {{-- Image modal --}}
                            <div x-show="show" x-transition x-cloak @keydown.escape.window="show = false"
                                 class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur">
                                <div @click.outside="show = false" class="max-w-4xl w-full px-4 relative">
                                    <img :src="image" alt="expanded image"
                                         class="rounded-lg shadow-xl mx-auto max-h-[90dvh]"/>
                                    <button @click="show = false"
                                            class="absolute top-5 right-10 cursor-pointer text-zinc-300 bg-accent rounded-full p-2 hover:text-white text-3xl font-bold"
                                            aria-label="close modal">
                                        <flux:icon.x-mark/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    @else
                        <flux:text class="text-base">There are no images for this cabin at this time.</flux:text>
                    @endif
                </div>

                {{-- Policies --}}
                <div class="space-y-4">
                    <flux:heading level="2" size="xl" class=" text-zinc-100 font-semibold">
                        Good to Know
                    </flux:heading>
                    <div class="text-sm text-zinc-400 space-y-2">
                        <p>🕒 Check-in: 3:00 PM – Check-out: 11:00 AM</p>
                        <p>❌ No smoking inside. Pets allowed on request.</p>
                        <p>💳 Full refund if cancelled 7+ days before check-in.</p>
                    </div>
                </div>

                {{-- Reviews --}}
                <div class="space-y-6">
                    <flux:heading level="2" size="xl" class=" text-zinc-100 font-semibold">
                        Latest Reviews
                    </flux:heading>

                    @if($cabin->reviews->isNotEmpty())
                        @foreach($cabin->reviews as $review)
                            <div class="border border-zinc-700/40 rounded-xl p-6 bg-base-100">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="text-zinc-100 font-semibold">{{ $review->author_name }}</div>
                                    <div class="flex items-center gap-1 text-accent">
                                        @for($i = 1; $i <= 5; $i++)
                                            <flux:icon.star
                                                class="size-4 {{ $i <= $review->rating ? 'text-accent' : 'text-zinc-600' }}"/>
                                        @endfor
                                    </div>
                                </div>
                                <flux:text class="text-zinc-400 text-sm">{{ $review->comment }}</flux:text>
                                <flux:text class="text-zinc-500 text-xs mt-2">{{ $review->formatted_date }}</flux:text>
                            </div>
                        @endforeach
                    @else
                        <flux:text class="text-base">Not reviews available for this cabin.</flux:text>
                    @endif
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

                {{-- Rating --}}
                <div class="flex items-center gap-2 text-sm text-zinc-400">
                    <flux:icon.star class="size-4 text-accent"/>
                    <span class="text-zinc-100 font-medium">{{ number_format($cabin->rating, 2) }}</span>
                    <span>of {{ $cabin->reviews_count }} reviews</span>
                </div>

                {{-- Specifications --}}
                <ul class="text-sm flex items-center justify-between gap-4 text-zinc-400">
                    <li class="flex flex-col justify-center items-center gap-2">
                        <flux:icon.bath class="size-4 text-accent"/>
                        {{ $cabin->baths }} {{ \Illuminate\Support\Str::plural('bathroom', $cabin->bathrooms) }}
                    </li>
                    <li class="flex flex-col justify-center items-center gap-2">
                        <flux:icon.bed-double class="size-4 text-accent"/>
                        {{ $cabin->beds }} {{ \Illuminate\Support\Str::plural('bed', $cabin->bedrooms) }}
                    </li>
                    <li class="flex flex-col justify-center items-center gap-2">
                        <flux:icon.user-plus class="size-4 text-accent"/>
                        Max {{ $cabin->max_guests }} guests
                    </li>
                </ul>

                <flux:separator/>

                <livewire:booking-card :cabin="$cabin"/>
            </div>
        </div>

        <flux:separator/>
    </section>


    @if($recommendedCabins && count($recommendedCabins))
        <section class="max-w-7xl mx-auto px-8 pb-20 space-y-10">
            <h2 class="text-2xl font-semibold text-zinc-100">Other Cabins You Might Like</h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                @foreach($recommendedCabins as $cabin)
                    <x-cabin-card :cabin="$cabin"/>
                @endforeach
            </div>
        </section>
    @endif
</x-pages-layout>
