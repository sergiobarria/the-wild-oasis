@php
    use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;
@endphp

<div>
    <form wire:submit.prevent="submit" class="space-y-6">
        <div class="space-y-4">
            <flux:heading level="3" size="lg">General Information</flux:heading>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {{-- Cabin Name --}}
                <div class="col-span-full">
                    <flux:label for="name">Cabin Name <span class="text-red-500">*</span></flux:label>
                    <flux:input wire:model="name" id="name" type="text" placeholder="e.g., Emerald Retreat"
                                class="mt-1 block w-full"/>
                    @error('name') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                </div>

                {{-- Price per Night --}}
                <div>
                    <flux:label for="price_per_night">Price per Night <span class="text-red-500">*</span></flux:label>
                    <flux:input wire:model="price_per_night" id="price_per_night" type="number" step="0.01" min="0.01"
                                placeholder="250.00" class="mt-1 block w-full"/>
                    @error('price_per_night') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                </div>

                {{-- Discount Percentage --}}
                <div>
                    <flux:label for="discount_percentage">Discount (%)</flux:label>
                    <flux:input wire:model="discount_percentage" id="discount_percentage" type="number" step="0.01"
                                min="0" max="100" placeholder="e.g., 10.00" class="mt-1 block w-full"/>
                    @error('discount_percentage') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                </div>
            </div>
        </div>

        <flux:separator/>

        <div class="space-y-4">
            <flux:heading level="3" size="lg">Capacity & Amenities</flux:heading>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                {{-- Max Guests --}}
                <div>
                    <flux:label for="max_guests">Max. Guests <span class="text-red-500">*</span></flux:label>
                    <flux:input wire:model="max_guests" id="max_guests" type="number" min="1" max="100" placeholder="4"
                                class="mt-1 block w-full"/>
                    @error('max_guests') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                </div>

                {{-- Beds --}}
                <div>
                    <flux:label for="beds">Beds <span class="text-red-500">*</span></flux:label>
                    <flux:input wire:model="beds" id="beds" type="number" min="1" max="10" placeholder="2"
                                class="mt-1 block w-full"/>
                    @error('beds') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                </div>

                {{-- Baths --}}
                <div>
                    <flux:label for="baths">Baths <span class="text-red-500">*</span></flux:label>
                    <flux:input wire:model="baths" id="baths" type="number" min="1" max="10" placeholder="1"
                                class="mt-1 block w-full"/>
                    @error('baths') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                </div>
            </div>
        </div>

        <flux:separator/>

        <div class="space-y-4">
            <flux:heading level="3" size="lg">Details & Description</flux:heading>
            {{-- Summary --}}
            <div>
                <flux:label for="summary">Short Summary <span class="text-red-500">*</span></flux:label>
                <flux:textarea wire:model="summary" id="summary" placeholder="A brief description for listings..."
                               class="mt-1 block w-full" rows="3"></flux:textarea>
                @error('summary') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
            </div>

            {{-- Description --}}
            <div>
                <flux:label for="description">Full Description</flux:label>
                <flux:textarea wire:model="description" id="description"
                               placeholder="Provide a detailed description of the cabin, amenities, surroundings..."
                               class="mt-1 block w-full" rows="5"></flux:textarea>
                @error('description') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
            </div>
        </div>

        <flux:separator/>

        <div class="space-y-6">
            <div>
                <flux:label for="images">Upload Images (Max 10)</flux:label>
                <input wire:model="images" id="images" type="file" multiple
                       class="mt-1 block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-accent file:text-accent-foreground
                          hover:file:bg-blue-100"/>
                @error('images') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                @error('images.*') <span
                    class="text-red-500 text-sm">{{ $message }}</span> @enderror {{-- Para errores por archivo --}}

                {{-- Loading spinner --}}
                <div wire:loading wire:target="images" class="mt-2 text-accent">Uploading...</div>

                {{-- Image Preview --}}
                @if ($images)
                    <div class="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        @foreach ($images as $image)
                            @if ($image instanceof TemporaryUploadedFile)
                                <div class="relative">
                                    <img src="{{ $image->temporaryUrl() }}" alt="{{ $image->getFilename() }}"
                                         class="w-full h-24 object-cover rounded-md shadow-md"/>
                                    <span
                                        class="absolute top-1 right-1 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded-full">
                                    {{ round($image->getSize() / 1024 / 1024, 2) }} MB
                                </span>
                                </div>
                            @endif
                        @endforeach
                    </div>
                @endif
            </div>
        </div>

        <div class="flex justify-end gap-x-2 pt-4">
            <flux:modal.close>
                <flux:button>Cancel</flux:button>
            </flux:modal.close>
            <flux:button type="submit" variant="primary">
                <span wire:loading.remove wire:target="submit">Save Cabin</span>
                <span wire:loading wire:target="submit">Saving...</span>
            </flux:button>
        </div>
    </form>
</div>
