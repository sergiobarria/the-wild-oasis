<x-app-layout>

    <flux:sidebar sticky collapsible class="bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-700">
        <flux:sidebar.header>
            <flux:sidebar.brand
                href="{{ route('admin.overview') }}"
                logo="{{ asset('assets/logo-2.webp') }}"
                logo:dark="{{ asset('assets/logo-2.webp') }}"
                name="{{ config('app.name') }}"
            />
        </flux:sidebar.header>

        <flux:sidebar.nav>
            <flux:sidebar.item icon="home" href="{{ route('admin.overview') }}">Home</flux:sidebar.item>
            <flux:sidebar.item icon="calendar" badge="12" href="{{ route('admin.bookings') }}">
                Bookings
            </flux:sidebar.item>
            <flux:sidebar.item icon="fire" href="{{ route('admin.cabins') }}">Cabins</flux:sidebar.item>
            <flux:sidebar.item icon="chat-bubble-left" href="{{ route('admin.messages') }}">Messages</flux:sidebar.item>
            <flux:sidebar.item icon="mail" href="{{ route('admin.subscribers') }}">Subscribers</flux:sidebar.item>
            <flux:sidebar.item icon="users" href="{{ route('admin.users') }}">Users</flux:sidebar.item>
        </flux:sidebar.nav>

        <flux:sidebar.spacer/>

        <flux:sidebar.nav>
            <flux:sidebar.item icon="cog-6-tooth" href="{{ route('admin.settings') }}">Settings</flux:sidebar.item>
            <flux:sidebar.item icon="information-circle" href="#">Help</flux:sidebar.item>
        </flux:sidebar.nav>
    </flux:sidebar>

    <flux:header class="block! bg-white lg:bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700">
        <flux:navbar class="lg:hidden w-full">
            <flux:sidebar.toggle class="lg:hidden" icon="bars-2" inset="left"/>
            <flux:spacer/>
            <flux:dropdown position="top" align="start">
                <flux:profile avatar="https://fluxui.dev/img/demo/user.png"/>
                <flux:menu>
                    <flux:menu.radio.group>
                        <flux:menu.radio checked>Olivia Martin</flux:menu.radio>
                        <flux:menu.radio>Truly Delta</flux:menu.radio>
                    </flux:menu.radio.group>
                    <flux:menu.separator/>
                    <flux:menu.item icon="arrow-right-start-on-rectangle">Logout</flux:menu.item>
                </flux:menu>
            </flux:dropdown>
        </flux:navbar>
        <flux:navbar class="hidden lg:flex">
            <flux:sidebar.collapse
                class="in-data-flux-sidebar-on-desktop:not-in-data-flux-sidebar-collapsed-desktop:-mr-2"
            />
            <flux:spacer/>
            <flux:button x-data x-on:click="$flux.dark = ! $flux.dark">Toggle</flux:button>
        </flux:navbar>
    </flux:header>

    <flux:main>
        {{ $slot }}
    </flux:main>
</x-app-layout>
