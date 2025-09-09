<x-app-layout title="Login">
    <div class="min-h-screen flex items-center justify-center space-y-6 flex-col">
        <livewire:auth.login-form/>

        <p>
            Don't have an account yet, <a href="{{ route('register') }}"
                                          class="text-accent hover:underline">Register</a>
            instead.
        </p>

        <flux:button href="{{ route('home') }}" variant="ghost">
            Return home
        </flux:button>
    </div>
</x-app-layout>
