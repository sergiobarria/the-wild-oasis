<x-layouts.app title="Contact">
    <section id="contact" class="max-w-7xl container mx-auto px-8 py-12">
        <h2 class="text-3xl font-medium text-accent mb-8 text-center">Get in Touch</h2>

        <livewire:contact-form/>

        <div class="mt-24 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div
                class="bg-base-100 border border-zinc-700/50 rounded-2xl px-6 py-10 flex flex-col items-center text-center shadow-md transition-all hover:shadow-lg">
                <div class="bg-accent/10 p-3 rounded-full mb-4">
                    <x-lucide-map-pin class="size-6 text-accent"/>
                </div>
                <h3 class="text-zinc-100 font-semibold text-lg mb-2">Address</h3>
                <p class="text-zinc-400 leading-relaxed text-sm">
                    The Wild Oasis, Via delle Dolomiti 25<br>
                    39030 Cortina d'Ampezzo (BZ), Italy
                </p>
            </div>

            <div
                class="bg-base-100 border border-zinc-700/50 rounded-2xl px-6 py-10 flex flex-col items-center text-center shadow-md transition-all hover:shadow-lg">
                <div class="bg-accent/10 p-3 rounded-full mb-4">
                    <x-lucide-mail class="size-6 text-accent"/>
                </div>
                <h3 class="text-zinc-100 font-semibold text-lg mb-2">Email</h3>
                <a href="mailto:hello@thewildoasis.com"
                   class="text-zinc-400 text-sm hover:text-accent transition-colors">
                    hello@thewildoasis.com
                </a>
            </div>

            <div
                class="bg-base-100 border border-zinc-700/50 rounded-2xl px-6 py-10 flex flex-col items-center text-center shadow-md transition-all hover:shadow-lg">
                <div class="bg-accent/10 p-3 rounded-full mb-4">
                    <x-lucide-phone class="size-6 text-accent"/>
                </div>
                <h3 class="text-zinc-100 font-semibold text-lg mb-2">Phone</h3>
                <a href="tel:+1234567890" class="text-zinc-400 text-sm hover:text-accent transition-colors">
                    +1 (234) 567-890
                </a>
            </div>
        </div>
    </section>
</x-layouts.app>
