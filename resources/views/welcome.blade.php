<x-pages-layout title="Home">
    <section id="hero" class="relative bg-red-500 h-[80dvh]">
        <img src="{{ asset("/assets/bg.webp") }}" alt="hero" class="absolute inset-0 object-cover size-full"/>
        <div class="absolute inset-0 bg-zinc-900/70"></div>

        <div class="absolute top-1/2 left-1/2 w-full transform -translate-x-1/2 -translate-y-1/2 text-center">
            <h1 class="text-5xl md:text-7xl font-medium">Welcome To Paradise</h1>
            <p class="max-w-xl mx-auto text-base md:text-lg text-white/70">
                Escape to the heart of nature and unwind in our handcrafted luxury cabins — where tranquility, comfort,
                and adventure meet.
            </p>

            <a
                href="{{ route('cabins.index') }}"
                class="bg-accent hover:bg-accent/90 rounded-lg transition-colors duration-300 ease-in-out cursor-pointer px-5 py-3 text-accent-foreground inline-block mt-4"
            >
                Explore our luxury cabins
            </a>
        </div>
    </section>

    <section id="benefits" class="py-16 px-6 max-w-6xl mx-auto text-center space-y-16">
        <div>
            <h2 class="text-3xl font-bold text-accent">Why Choose Us?</h2>
            <p class="text-zinc-400 mt-4 max-w-xl mx-auto">We offer more than just a stay. Discover a curated experience
                surrounded by nature, designed for those who seek comfort, privacy, and beauty.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 text-left">
            <div class="bg-base-100 rounded-xl p-6 shadow space-y-3">
                <flux:icon.mountain class="text-accent size-8"/>
                <h3 class="text-xl font-semibold">Breathtaking Locations</h3>
                <p class="text-zinc-400">Each cabin is nestled in unique natural settings, offering stunning views and
                    serenity.</p>
            </div>
            <div class="bg-base-100 rounded-xl p-6 shadow space-y-3">
                <flux:icon.bed-double class="text-accent size-8"/>
                <h3 class="text-xl font-semibold">Premium Comfort</h3>
                <p class="text-zinc-400">Our cabins are equipped with high-end amenities, cozy interiors, and everything
                    you need to relax.</p>
            </div>
            <div class="bg-base-100 rounded-xl p-6 shadow space-y-3">
                <flux:icon.flame class="text-accent size-8"/>
                <h3 class="text-xl font-semibold">Unforgettable Experiences</h3>
                <p class="text-zinc-400">From private hot tubs to hiking adventures, you’ll create lasting memories.</p>
            </div>
        </div>
    </section>

    <section id="testimonials" class="py-20 px-6 max-w-6xl mx-auto space-y-16">
        <div class="text-center">
            <h2 class="text-3xl font-bold text-accent">What Our Guests Say</h2>
            <p class="text-zinc-400 mt-4 max-w-xl mx-auto">We’re proud to share the stories of our happy guests who’ve
                experienced the tranquility and charm of our cabins.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
            @php
                $testimonials = [
                    [
                        'name' => 'Sarah',
                        'message' => 'This was the most peaceful vacation I’ve ever had. The views, the cabin, everything was perfect.',
                    ],
                    [
                        'name' => 'Daniel',
                        'message' => 'An unforgettable experience! The hot tub under the stars was the highlight of our trip.',
                    ],
                    [
                        'name' => 'María',
                        'message' => 'The location, the comfort, the privacy—everything exceeded our expectations. We’ll be back!',
                    ],
                ];
            @endphp

            @foreach ($testimonials as $testimonial)
                <div class="bg-base-100 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center space-y-4">
                    <img src="{{ asset('/assets/placeholder.jpg') }}"
                         alt="{{ $testimonial['name'] }}"
                         class="w-20 h-20 rounded-full object-cover ring-2 ring-accent shadow-sm"/>

                    <p class="text-sm text-zinc-400 italic">“{{ $testimonial['message'] }}”</p>

                    <div class="text-sm font-semibold text-accent">{{ $testimonial['name'] }}</div>
                </div>
            @endforeach
        </div>
    </section>


    <section class="py-20 px-6 bg-base-200">
        <div class="max-w-xl mx-auto text-center space-y-6">
            <h2 class="text-3xl font-bold text-primary">Join Our Newsletter</h2>
            <p class="text-zinc-400">Be the first to know about new cabins, exclusive offers, and travel
                inspiration.</p>

            <livewire:newsletter/>
        </div>
    </section>
</x-pages-layout>
