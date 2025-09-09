<form wire:submit.prevent="book" class="space-y-6">
    <flux:field>
        <flux:label>Pick your dates</flux:label>
        <div class="bg-zinc-800 rounded-lg">
            <flux:calendar
                name="dates"
                wire:model.live="range"
                size="xs"
                :selectable-header="true"
                mode="range"
                months="1"
                min="today"
                unavailable="{{ $cabin->unavailable_dates }}"
            />
        </div>
        <flux:error name="dates"/>
    </flux:field>

    <flux:field>
        <flux:label>Number of Guests</flux:label>
        <flux:input name="guests" wire:model.live.debounce="guests" type="number"/>
        <flux:error name="guests"/>
    </flux:field>

    <flux:button type="submit" variant="primary" spinner="book" class="cursor-pointer w-full">
        Book this Cabin
    </flux:button>

    @if (session()->has('error'))
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md" role="alert">
            <p class="font-bold">Error!</p>
            <p>{{ session('error') }}</p>
        </div>
    @endif
</form>
