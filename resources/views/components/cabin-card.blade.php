@props(['cabin'])

<div
    class="bg-base-100 border border-zinc-700/40 rounded-xl overflow-hidden shadow hover:shadow-lg transition">
    <img src="{{ asset($cabin->getFirstMediaUrl('cabins')) }}" alt="{{ $cabin->name }}"
         class="w-full h-56 object-cover"/>

    <div class="p-5 space-y-3">
        <h3 class="text-lg font-semibold text-zinc-100">{{ $cabin->name }}</h3>

        <div class="text-zinc-100 font-medium">
            ${{ $cabin->price_per_night }} <span class="text-sm text-zinc-400">/ night</span>
        </div>

        <ul class="flex gap-6 text-zinc-400 text-sm">
            <li class="flex items-center gap-1">
                <flux:icon.bath class="size-4 text-accent"/>
                {{ $cabin->baths }} Beds
            </li>
            <li class="flex items-center gap-1">
                <flux:icon.bed-double class="size-4 text-accent"/>
                {{ $cabin->beds }} Bathrooms
            </li>
            <li class="flex items-center gap-1">
                <flux:icon.user-plus class="size-4 text-accent"/>
                Max {{ $cabin->max_guests }} guests
            </li>
        </ul>

        <div class="pt-2">
            <a
                href="{{ route('cabins.show', $cabin->slug) }}"
                class="inline-flex items-center gap-1 text-accent hover:text-accent-content text-sm font-medium transition"
            >
                View Details
                <flux:icon.arrow-right class="size-4 ml-2"/>
            </a>
        </div>
    </div>
</div>
