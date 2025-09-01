<form wire:submit.prevent="update" class="mt-6 space-y-6">
    @csrf

    @if (session()->has('success'))
        <div class="bg-green-100 text-green-800 text-sm px-4 py-2 rounded">
            {{ session('success') }}
        </div>
    @endif

    <div class="grid grid-cols-2 gap-6">
        <flux:field>
            <flux:label>Full Name</flux:label>
            <flux:input wire:model.defer="name" type="text" placeholder="John Doe"/>
            <flux:error name="name"/>
        </flux:field>

        <flux:field>
            <flux:label>Email</flux:label>
            <flux:input wire:model.defer="email" type="email" placeholder="john@email.com"/>
            <flux:error name="email"/>
        </flux:field>
    </div>

    <div class="grid grid-cols-2 gap-6">
        <flux:field>
            <flux:label>National ID</flux:label>
            <flux:input wire:model.defer="nationalId" type="text"/>
            <flux:error name="nationalId"/>
        </flux:field>

        <flux:field>
            <flux:label>Where are you from?</flux:label>
            <flux:select wire:model.defer="nationality" placeholder="Choose your country of birth...">
                @foreach ($countries as $code => $name)
                    <flux:select.option value="{{ $code }}">{{ $name }}</flux:select.option>
                @endforeach
            </flux:select>
            <flux:error name="nationality"/>
        </flux:field>
    </div>

    <flux:button type="submit" variant="primary" class="cursor-pointer">Update my profile</flux:button>
</form>
