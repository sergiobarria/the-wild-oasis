<x-layouts.app :title="$cabin->name">
    <section class="max-w-7xl mx-auto px-8 pt-12 space-y-20">
        {{-- Imagen destacada --}}
        <div class="relative h-[60vh] rounded-xl overflow-hidden shadow">
            <img src="{{ asset($cabin->main_image) }}" alt="{{ $cabin->name }}"
                 class="object-cover w-full h-full"/>
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-6 left-6 text-white">
                <h1 class="text-4xl font-bold">{{ $cabin->name }}</h1>
                <p class="text-zinc-300 mt-2">{{ $cabin->location }}</p>
            </div>
        </div>

        {{-- Contenido principal --}}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
            {{-- Columna izquierda --}}
            <div class="md:col-span-2 space-y-10 text-zinc-400 leading-relaxed">

                {{-- Descripción + Testimonial --}}
                <div class="space-y-4">
                    <h2 class="text-2xl text-zinc-100 font-semibold">Description</h2>
                    <p>{{ $cabin->description }}</p>

                    <blockquote class="border-l-4 border-accent pl-4 text-lg italic text-zinc-300">
                        “The most relaxing vacation we've had in years. We’ll be back every winter.”
                    </blockquote>
                </div>

                {{-- Tags emocionales --}}
                <div class="space-y-2 text-sm">
                    <p>🌿 Perfect for couples seeking peace & nature</p>
                    <p>🔥 Great for winter retreats with fireplace & hot tub</p>
                    <p>👨‍👩‍👧 Ideal for families (max {{ $cabin->capacity }} guests)</p>
                </div>

                {{-- Amenities --}}
                <div>
                    <h3 class="text-lg text-zinc-100 font-medium mb-4">Features</h3>
                    <ul class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                        @foreach($cabin->amenities as $amenity)
                            <li class="flex items-center gap-2">
                                <x-lucide-check class="text-accent size-4"/>
                                {{ $amenity }}
                            </li>
                        @endforeach
                    </ul>
                </div>

                {{-- Galería --}}
                @if($cabin->gallery && count($cabin->gallery))
                    <div>
                        <h3 class="text-lg text-zinc-100 font-medium mb-6">Gallery</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            @foreach($cabin->gallery as $image)
                                <img src="{{ asset($image) }}"
                                     alt="{{ $cabin->name }} photo"
                                     class="rounded-lg object-cover h-48 w-full"/>
                            @endforeach
                        </div>
                    </div>
                @endif

                {{-- Reseñas --}}
                @if($cabin->reviews && count($cabin->reviews))
                    <div class="space-y-8">
                        <h3 class="text-lg text-zinc-100 font-medium">Guest Reviews</h3>

                        @foreach($cabin->reviews as $review)
                            <div class="border border-zinc-700/40 rounded-xl p-6 bg-base-100">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="text-zinc-100 font-semibold">{{ $review['author'] }}</div>
                                    <div class="flex items-center gap-1 text-yellow-400">
                                        @for($i = 1; $i <= 5; $i++)
                                            <x-lucide-star
                                                class="size-4 {{ $i <= $review['rating'] ? 'text-yellow-400' : 'text-zinc-600' }}"/>
                                        @endfor
                                    </div>
                                </div>
                                <p class="text-zinc-400 text-sm">{{ $review['comment'] }}</p>
                                <p class="text-zinc-500 text-xs mt-2">{{ $review['date'] }}</p>
                            </div>
                        @endforeach
                    </div>
                @endif

                {{-- Políticas --}}
                <div class="pt-12 border-t border-zinc-700/30">
                    <h3 class="text-lg text-zinc-100 font-medium mb-4">Good to know</h3>
                    <div class="text-sm text-zinc-400 space-y-2">
                        <p>🕒 Check-in: 3:00 PM – Check-out: 11:00 AM</p>
                        <p>❌ No smoking inside. Pets allowed on request.</p>
                        <p>💳 Full refund if cancelled 7+ days before check-in.</p>
                    </div>
                </div>

            </div>

            {{-- Columna derecha (Info rápida y CTA) --}}
            <div class="self-start sticky top-6 bg-base-100 border border-zinc-700/50 rounded-xl p-6 shadow space-y-6">
                {{-- Precio --}}
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
                    <span class="text-zinc-100 font-medium">{{ number_format($cabin->rating, 1) }}</span>
                    <span>({{ $cabin->reviews_count }} reviews)</span>
                </div>

                {{-- Especificaciones --}}
                <ul class="text-sm text-zinc-400 space-y-3">
                    <li class="flex items-center gap-2">
                        <x-lucide-users class="size-4 text-accent"/>
                        Sleeps {{ $cabin->capacity }}
                    </li>
                    <li class="flex items-center gap-2">
                        <x-lucide-bed class="size-4 text-accent"/>
                        {{ $cabin->beds }} bed(s)
                    </li>
                    <li class="flex items-center gap-2">
                        <x-lucide-map-pin class="size-4 text-accent"/>
                        {{ $cabin->location }}
                    </li>
                </ul>

                {{-- CTA --}}
                <div class="pt-4">
                    <a
                        href="{{ route('cabins.show', $cabin->slug) }}"
                        class="block text-center bg-accent text-accent-foreground px-6 py-3 text-sm font-medium rounded hover:bg-accent-content transition"
                    >
                        Book this cabin
                    </a>
                </div>
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
                        <img src="{{ asset($cabin->image) }}" alt="{{ $cabin->name }}"
                             class="w-full h-48 object-cover"/>

                        <div class="p-5 space-y-3">
                            <h3 class="text-lg font-semibold text-zinc-100">{{ $cabin->name }}</h3>
                            <p class="text-zinc-400 text-sm">{{ $cabin->location }}</p>

                            <div class="text-zinc-100 font-medium">
                                ${{ $cabin->price_per_night }} <span class="text-sm text-zinc-400">/ night</span>
                            </div>

                            <ul class="flex gap-4 text-sm text-zinc-400">
                                <li class="flex items-center gap-1">
                                    <x-lucide-bed class="size-4 text-accent"/>
                                    {{ $cabin->beds }} beds
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
