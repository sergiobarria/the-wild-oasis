<x-layouts.app title="Home">
    <section id="hero" class="relative bg-red-500 h-[80dvh]">
        <img src="{{ asset("/images/bg.webp") }}" alt="hero" class="absolute inset-0 object-cover size-full"/>
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
</x-layouts.app>
