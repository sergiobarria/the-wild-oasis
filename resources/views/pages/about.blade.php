<x-layouts.app title="About">
    <div class="max-w-7xl container mx-auto px-8 py-12">
        <div class="grid grid-cols-5 gap-x-24 gap-y-32 text-lg items-center">
            <div class="col-span-3">
                <h1 class="text-4xl mb-10 text-accent font-medium">
                    Welcome to The Wild Oasis
                </h1>

                <div class="space-y-8">
                    <p>
                        Where nature's beauty and comfortable living blend seamlessly.
                        Hidden away in the heart of the Italian Dolomites, this is your
                        paradise away from home. But it's not just about the luxury cabins.
                        It's about the experience of reconnecting with nature and enjoying
                        simple pleasures with family.
                    </p>
                    <p>
                        Our 8 luxury cabins provide a cozy base, but the real freedom and
                        peace you'll find in the surrounding mountains. Wander through lush
                        forests, breathe in the fresh air, and watch the stars twinkle above
                        from the warmth of a campfire or your hot tub.
                    </p>
                    <p>
                        This is where memorable moments are made, surrounded by nature's
                        splendor. It's a place to slow down, relax, and feel the joy of
                        being together in a beautiful setting.
                    </p>
                </div>
            </div>

            <div class="col-span-2">
                <img
                    src="{{ asset('images/about-1.webp') }}"
                    alt="Family sitting around a fire pit in front of cabin"
                />
            </div>

            <div class="col-span-2">
                <img src="{{ asset('images/about-2.webp') }}" alt="Family that manages The Wild Oasis"/>
            </div>

            <div class="col-span-3">
                <h1 class="text-4xl mb-10 text-accent font-medium">
                    Managed by our family since 1962
                </h1>

                <div class="space-y-8">
                    <p>
                        Since 1962, The Wild Oasis has been a cherished family-run retreat.
                        Started by our grandparents, this haven has been nurtured with love
                        and care, passing down through our family as a testament to our
                        dedication to creating a warm, welcoming environment.
                    </p>
                    <p>
                        Over the years, we've maintained the essence of The Wild Oasis,
                        blending the timeless beauty of the mountains with the personal
                        touch only a family business can offer. Here, you're not just a
                        guest; you're part of our extended family. So join us at The Wild
                        Oasis soon, where tradition meets tranquility, and every visit is
                        like coming home.
                    </p>

                    <div>
                        <a
                            href="{{ route('cabins.index') }}"
                            class="inline-block mt-4 bg-accent rounded-lg px-4 py-3 text-accent-foreground text-lg font-semibold hover:bg-accent-content transition-all"
                        >
                            Explore our luxury cabins
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-layouts.app>
