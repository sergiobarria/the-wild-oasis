<x-layouts.app>
    <div class="max-w-4xl mx-auto py-20 px-4 text-center">
        <x-lucide-check-circle class="mx-auto mb-6 size-16 text-green-500"/>
        <h1 class="text-4xl font-bold mb-4">Payment Successful</h1>
        <p class="text-gray-500 text-xl mb-6">
            Thank you for booking with us! A confirmation email has been sent to you.
        </p>

        <div class="space-x-3">
            <flux:button href="{{ route('pages.home') }}">
                Return to Homepage
            </flux:button>
            @auth
                <flux:button variant="primary" href="{{ route('account.reservations') }}">
                    My Reservations
                </flux:button>
            @endauth
        </div>
    </div>
</x-layouts.app>

