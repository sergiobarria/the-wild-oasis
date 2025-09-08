<x-admin-layout>
    <div class="flex items-center justify-between">
        <div>
            <flux:heading size="xl" level="1">Cabins</flux:heading>
            <flux:text>Manage all available cabins.</flux:text>
        </div>

        <flux:modal.trigger name="new-cabin">
            <flux:button icon="plus-circle" variant="primary">New Cabin</flux:button>
        </flux:modal.trigger>
    </div>

    <flux:modal name="new-cabin" class="min-w-[600px] max-w-[800px]">
        <div class="space-y-6">
            <div>
                <flux:heading size="lg">New cabin</flux:heading>
                <flux:text class="mt-2">Register a new cabin into the system.</flux:text>
            </div>

            <livewire:cabins.create-cabin-form/>
        </div>
    </flux:modal>

    <livewire:cabins-table/>
</x-admin-layout>
