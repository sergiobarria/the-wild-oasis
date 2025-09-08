<div class="mt-8">
    <flux:input type="string" wire:model.live.debounce="search" icon="magnifying-glass"
                placeholder="Search cabins by name..." class="w-full"/>

    <flux:text class="mt-2 mb-8">Results: {{ count($cabins) }}</flux:text>

    @if(count($cabins) > 0)
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @foreach($cabins as $cabin)
                <x-cabin-card :cabin="$cabin"/>
            @endforeach
        </div>
    @else
        <flux:text class="text-base text-center">No results to show</flux:text>
    @endif
</div>
