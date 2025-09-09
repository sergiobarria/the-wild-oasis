<x-app-layout title="Payment Successful">
    <div class="max-w-4xl mx-auto py-20 px-4 text-center">
        <flux:icon.check-circle class="mx-auto mb-6 size-16 text-green-500"/>
        <flux:heading level="1" size="xl" class="text-4xl font-bold mb-4">Payment Successful</flux:heading>
        <p class="text-gray-500 text-xl mb-6">
            Thank you for booking with us! A confirmation email has been sent to you.
        </p>

        <div class="space-x-3">
            <flux:button href="{{ route('home') }}">
                Return to Homepage
            </flux:button>
            @auth
                <flux:button variant="primary" href="{{ route('account.reservations') }}">
                    My Reservations
                </flux:button>
            @endauth
        </div>
    </div>
</x-app-layout>
