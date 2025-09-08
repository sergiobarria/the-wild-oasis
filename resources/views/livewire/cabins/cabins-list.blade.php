<div class="mt-8">
    <flux:input type="string" wire:model.live.debounce="search" icon="magnifying-glass"
                placeholder="Search cabins by name..." class="w-full"/>

    <flux:text class="mt-2 mb-8">Results: {{ count($cabins) }}</flux:text>

    @if(count($cabins) > 0)
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @foreach($cabins as $cabin)
                <div
                    class="bg-base-100 border border-zinc-700/50 rounded-2xl overflow-hidden shadow-sm transition hover:shadow-xl">
                    <img src="{{ $cabin->getFirstMediaUrl('cabins') }}" alt="{{ $cabin->name }}"
                         class="w-full h-56 object-cover"/>

                    <div class="p-6 space-y-4">
                        <div class="flex justify-between items-start">
                            <flux:heading level="2" size="lg"
                                          class="font-semibold text-zin-100">{{ $cabin->name }}</flux:heading>
                            <span>${{ number_format($cabin->price_per_night, 2) }} <span class="text-sm text-zinc-400">/night</span></span>
                        </div>

                        <flux:text class="text-zinc-400 leading-relaxed">{{ $cabin->summary }}</flux:text>

                        <ul class="flex gap-6 text-zinc-400 text-sm">
                            <li class="flex items-center gap-1">
                                <flux:icon.bed-double class="size-4 text-accent"/>
                                {{ $cabin->beds }} Beds
                            </li>
                            <li class="flex items-center gap-1">
                                <flux:icon.bath class="size-4 text-accent"/>
                                {{ $cabin->baths }} Bathrooms
                            </li>
                            <li class="flex items-center gap-1">
                                <flux:icon.user-plus class="size-4 text-accent"/>
                                {{ $cabin->max_guests }} Guests
                            </li>
                        </ul>

                        <div class="pt-4">
                            <a
                                href="{{ route('cabins.show', ['slug' => $cabin->slug]) }}"
                                class="inline-block bg-accent text-accent-foreground px-4 py-2 text-sm font-medium rounded hover:bg-accent-content transition"
                            >
                                View Details
                            </a>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    @else
        <flux:text class="text-base text-center">No results to show</flux:text>
    @endif
</div>
