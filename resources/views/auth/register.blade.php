<x-app-layout title="Register">
    <div class="min-h-screen flex items-center justify-center space-y-6 flex-col">
        <livewire:auth.register-form/>

        <p>
            Already have an account, <a href="{{ route('login') }}" class="text-accent hover:underline">Login</a>
            instead.
        </p>

        <flux:button href="{{ route('home') }}" variant="ghost">
            Return home
        </flux:button>
    </div>
</x-app-layout>
