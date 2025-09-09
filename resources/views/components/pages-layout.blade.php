<x-app-layout title="{{ $title ?: '' }}">
    <div class="flex flex-col min-h-screen">
        <header class="border-b border-zinc-700 px-8 py-3">
            <div class="flex justify-between items-center mx-auto max-w-7xl">
                <a href="{{ route('home') }}" class="flex items-center gap-4 z-10">
                    <img src="{{ asset("/assets/logo-2.webp") }}" alt="logo" width="50" height="50"/>
                    <span class="text-xl font-semibold text-zinc-100">The Wild Oasis</span>
                </a>

                <nav class="flex gap-12 items-center">
                    <x-nav-link :href="route('cabins.index')" :active="request()->routeIs('cabins.index')">
                        Cabins
                    </x-nav-link>

                    <x-nav-link :href="route('about')" :active="request()->routeIs('about')">
                        About
                    </x-nav-link>

                    <x-nav-link :href="route('contact')" :active="request()->routeIs('contact')">
                        Contact
                    </x-nav-link>

                    @auth
                        <div class="space-x-3 flex items-center">
                            <flux:button variant="primary" href="{{ route('admin.overview') }}" icon="user-group"
                                         size="sm"
                                         class="cursor-pointer">
                                Guest Area
                            </flux:button>

                            <flux:button href="{{ route('admin.overview') }}" icon="layout-dashboard" size="sm"
                                         class="cursor-pointer">
                                Dashboard
                            </flux:button>

                            <form method="POST" action="{{ route('logout') }}">
                                @csrf

                                <flux:button type="submit" variant="subtle" icon="log-out" size="sm"
                                             class="cursor-pointer">
                                    Logout
                                </flux:button>
                            </form>
                        </div>
                    @else
                        <div class="space-x-3">
                            <flux:button href="{{ route('login') }}" variant="primary" icon="log-in" size="sm"
                                         class="cursor-pointer">
                                Sign In
                            </flux:button>
                            <flux:button href="{{ route('register') }}" icon="user-plus" size="sm"
                                         class="cursor-pointer">
                                Register
                            </flux:button>
                        </div>
                    @endauth
                </nav>

            </div>
        </header>

        <div class="flex-1 grid ">
            <main class="w-full">
                {{ $slot }}
            </main>
        </div>

        <footer class="bg-base-100 border-t border-zinc-800 text-zinc-400 text-sm">
            <div class="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
                {{-- Logo --}}
                <div>
                    <a href="{{ route('home') }}" class="flex items-center gap-4 mb-4">
                        <img src="{{ asset('/assets/logo-2.webp') }}" alt="The Wild Oasis logo" width="40" height="40"/>
                        <span class="text-lg font-semibold text-zinc-100">The Wild Oasis</span>
                    </a>
                    <p class="leading-relaxed max-w-xs">
                        Luxury cabins in the heart of the Dolomites. Unwind, reconnect, and experience the magic of
                        nature.
                    </p>
                </div>

                {{-- Navigation --}}
                <div>
                    <h4 class="text-zinc-100 font-medium mb-4">Explore</h4>
                    <ul class="space-y-2">
                        <li><a href="{{ route('cabins.index') }}" class="hover:text-accent transition-colors">Cabins</a>
                        </li>
                        <li><a href="{{ route('about') }}" class="hover:text-accent transition-colors">About Us</a>
                        </li>
                        <li><a href="{{ route('contact') }}" class="hover:text-accent transition-colors">Contact</a>
                        </li>
                    </ul>
                </div>

                {{-- Contact --}}
                <div>
                    <h4 class="text-zinc-100 font-medium mb-4">Contact</h4>
                    <ul class="space-y-3">
                        <li>
                            <div class="flex items-center gap-2">
                                <flux:icon.mail class="size-4 text-accent"/>
                                <a href="mailto:hello@thewildoasis.com" class="hover:text-accent transition-colors">
                                    hello@thewildoasis.com
                                </a>
                            </div>
                        </li>
                        <li>
                            <div class="flex items-center gap-2">
                                <flux:icon.phone class="size-4 text-accent"/>
                                <a href="tel:+1234567890" class="hover:text-accent transition-colors">
                                    +1 (234) 567-890
                                </a>
                            </div>
                        </li>
                        <li>
                            <div class="flex items-start gap-2">
                                <flux:icon.map-pin class="size-4 text-accent mt-1"/>
                                <span class="leading-snug">
                            Via delle Dolomiti 25<br/>
                            39030 Cortina d'Ampezzo (BZ), Italy
                        </span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {{-- Bottom bar --}}
            <div class="border-t border-zinc-800 py-6 px-8 text-center text-zinc-500 text-xs">
                © {{ now()->year }} The Wild Oasis. All rights reserved.
            </div>
        </footer>
    </div>
</x-app-layout>
