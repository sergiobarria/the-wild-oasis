<div class="mt-8">

    <div class="mb-4">
        <flux:field>
            <flux:input wire:model.live.debounce.300ms="search" type="text"
                        placeholder="Search by name, summary or description..." class="max-w-[400px]"/>
        </flux:field>
    </div>

    @if($cabins->isEmpty() && $search)
        <p class="text-center mt-6">No cabins to show for search: {{ $search }}</p>
    @endif

    @if($cabins->isEmpty())
        <p class="text-center mt-6">No cabins to show.</p>
    @else
        <flux:table :paginate="$cabins">
            <flux:table.columns>
                <flux:table.column>Image</flux:table.column>
                <flux:table.column sortable>Cabin Name</flux:table.column>
                <flux:table.column>Max. Capacity</flux:table.column>
                <flux:table.column sortable>Price / night</flux:table.column>
                <flux:table.column>Discount (%)</flux:table.column>
            </flux:table.columns>

            <flux:table.rows>
                @foreach($cabins as $cabin)
                    <flux:table.row>
                        <flux:table.cell>
                            @php
                                $imageUrl = $cabin->getFirstMediaUrl('cabins');
                                $placeholderUrl = asset('assets/placeholder.jpg');
                            @endphp
                            <img src="{{ $imageUrl ?: $placeholderUrl }}"
                                 alt="{{ $cabin->name }} thumbnail" width="100" height="60"
                                 class="rounded-md object-cover"/>
                        </flux:table.cell>
                        <flux:table.cell>{{ $cabin->name }}</flux:table.cell>
                        <flux:table.cell>Fits up to {{ $cabin->max_guests }} guest(s)
                        </flux:table.cell>
                        <flux:table.cell>${{ number_format($cabin->price_per_night, 2) }}</flux:table.cell>
                        <flux:table.cell>{{ $cabin->discount_percentage ?? '-' }}</flux:table.cell>
                        <flux:table.cell>
                            <flux:dropdown>
                                <flux:button variant="ghost" size="sm"
                                             icon:trailing="ellipsis-horizontal"></flux:button>

                                <flux:menu>
                                    <flux:menu.group heading="Actions">
                                        <flux:menu.separator/>

                                        <flux:menu.item icon="plus">New cabin</flux:menu.item>
                                        <flux:menu.item icon="clipboard-document">Duplicate cabin</flux:menu.item>
                                        <flux:menu.item icon="pencil-square">Edit cabin</flux:menu.item>

                                        <flux:menu.item variant="danger" icon="trash"
                                                        wire:click="deleteCabin('{{ $cabin->id }}')">Delete
                                        </flux:menu.item>
                                    </flux:menu.group>

                                </flux:menu>
                            </flux:dropdown>
                        </flux:table.cell>
                    </flux:table.row>
                @endforeach
            </flux:table.rows>
        </flux:table>
    @endif
</div>
