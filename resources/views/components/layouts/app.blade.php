<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ isset($title) ? $title . ' | ' : '' }} The Wild Oasis</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">

        <!-- Favicon -->
        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('favicon/apple-touch-icon.png') }}">
        <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('favicon/favicon-32x32.png') }}">
        <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('favicon/favicon-16x16.png') }}">
        <link rel="manifest" href="{{ asset('favicon/site.webmanifest') }}">

        <!-- Styles / Scripts -->
        @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
            @vite(['resources/css/app.css', 'resources/js/app.js'])
        @endif

        @fluxAppearance
    </head>
    <body class="antialiased min-h-screen flex flex-col">
        <header class="border-b border-zinc-700 px-8 py-3">
            <div class="flex justify-between items-center mx-auto max-w-7xl">
                <a href="{{ route('pages.home') }}" class="flex items-center gap-4 z-10">
                    <img src="{{ asset("/images/logo.webp") }}" alt="logo" width="50" height="50" />
                    <span class="text-xl font-semibold text-zinc-100">The Wild Oasis</span>
                </a>

                <nav class="flex gap-16 items-center">
                    <x-nav-link :href="route('cabins.index')" :active="request()->routeIs('cabins.index')">
                        Cabins
                    </x-nav-link>

                    <x-nav-link :href="route('pages.about')" :active="request()->routeIs('pages.about')">
                        About
                    </x-nav-link>

                    <x-nav-link :href="route('pages.contact')" :active="request()->routeIs('pages.contact')">
                        Contact
                    </x-nav-link>
                </nav>

            </div>
        </header>

        <div class="flex-1">
            <main class="max-w-7xl mx-auto">{{ $slot }}</main>
        </div>

        <footer class="bg-base-100 border-t border-zinc-800 mt-24 text-zinc-400 text-sm">
            <div class="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
                {{-- Logo --}}
                <div>
                    <a href="{{ route('pages.home') }}" class="flex items-center gap-4 mb-4">
                        <img src="{{ asset('/images/logo.webp') }}" alt="The Wild Oasis logo" width="40" height="40" />
                        <span class="text-lg font-semibold text-zinc-100">The Wild Oasis</span>
                    </a>
                    <p class="leading-relaxed max-w-xs">
                        Luxury cabins in the heart of the Dolomites. Unwind, reconnect, and experience the magic of nature.
                    </p>
                </div>

                {{-- Navigation --}}
                <div>
                    <h4 class="text-zinc-100 font-medium mb-4">Explore</h4>
                    <ul class="space-y-2">
                        <li><a href="{{ route('cabins.index') }}" class="hover:text-accent transition-colors">Cabins</a></li>
                        <li><a href="{{ route('pages.about') }}" class="hover:text-accent transition-colors">About Us</a></li>
                        <li><a href="{{ route('pages.contact') }}" class="hover:text-accent transition-colors">Contact</a></li>
                    </ul>
                </div>

                {{-- Contact --}}
                <div>
                    <h4 class="text-zinc-100 font-medium mb-4">Contact</h4>
                    <ul class="space-y-3">
                        <li>
                            <div class="flex items-center gap-2">
                                <x-lucide-mail class="size-4 text-accent" />
                                <a href="mailto:hello@thewildoasis.com" class="hover:text-accent transition-colors">
                                    hello@thewildoasis.com
                                </a>
                            </div>
                        </li>
                        <li>
                            <div class="flex items-center gap-2">
                                <x-lucide-phone class="size-4 text-accent" />
                                <a href="tel:+1234567890" class="hover:text-accent transition-colors">
                                    +1 (234) 567-890
                                </a>
                            </div>
                        </li>
                        <li>
                            <div class="flex items-start gap-2">
                                <x-lucide-map-pin class="size-4 text-accent mt-1" />
                                <span class="leading-snug">
                            Via delle Dolomiti 25<br />
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

        @fluxScripts
    </body>
</html>
