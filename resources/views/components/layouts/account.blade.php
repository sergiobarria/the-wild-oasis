<x-layouts.app title="Guest Area">
    <div class="grid grid-cols-[16rem_1fr] h-full py-12 px-8">
        <aside class="w-52 border-r border-zinc-700 flex flex-col space-y-4">
            <a href="{{ route('account.index') }}"
               class="flex items-center gap-4 px-5 py-3 font-semibold rounded-lg
                                {{ request()->routeIs('account.index') ? 'bg-zinc-800 text-accent' : 'hover:bg-zinc-700' }}">
                <x-lucide-home class="size-5"/>
                <span class="text-base">Home</span>
            </a>

            <a href="{{ route('account.reservations') }}"
               class="flex items-center gap-4 px-5 py-3 font-semibold rounded-lg
                                {{ request()->routeIs('account.reservations') ? 'bg-zinc-800 text-accent' : 'hover:bg-zinc-700' }}">
                <x-lucide-calendar class="size-5"/>
                <span class="text-base">Reservations</span>
            </a>

            <a href="{{ route('account.profile') }}"
               class="flex items-center gap-4 px-5 py-3 font-semibold rounded-lg
                                {{ request()->routeIs('account.profile') ? 'bg-zinc-800 text-accent' : 'hover:bg-zinc-700' }}">
                <x-lucide-user class="size-5"/>
                <span class="text-base">My Profile</span>
            </a>

            <div class="mt-auto">
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit"
                            class="flex items-center gap-4 px-5 py-3 font-semibold w-full text-left hover:bg-zinc-700 rounded-lg cursor-pointer">
                        <x-lucide-log-out class="size-5 self-center"/>
                        <span class="text-base">Sign out</span>
                    </button>
                </form>
            </div>
        </aside>

        <section class="flex-1">
            {{ $slot }}
        </section>
    </div>
</x-layouts.app>
