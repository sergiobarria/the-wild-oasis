<x-app-layout>
    <div class="max-w-2xl mx-auto py-20 px-4 text-center">
        <flux:icon.x-circle class="mx-auto mb-6 size-16 text-rose-500"/>
        <flux:heading level="1" size="xl" class="text-4xl font-bold mb-4">Payment Cancelled</flux:heading>
        <p class="text-gray-500 mb-6">
            It looks like the payment process was cancelled. You can try again or contact support if needed.
        </p>

        <flux:button href="{{ route('home') }}">
            Go Back
        </flux:button>
    </div>
</x-app-layout>
