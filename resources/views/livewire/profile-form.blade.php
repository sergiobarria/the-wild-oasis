<form method="POST" action="" class="mt-6 space-y-6">
    @csrf

    <div class="grid grid-cols-2 gap-6">
        <flux:field>
            <flux:label>Full Name</flux:label>
            <flux:input wire:model="name" type="text" placeholder="John Doe"/>
            <flux:error name="name"/>
        </flux:field>

        <flux:field>
            <flux:label>Email</flux:label>
            <flux:input wire:model="email" type="email" placeholder="john@email.com"/>
            <flux:error name="email"/>
        </flux:field>
    </div>

    <div class="grid grid-cols-2 gap-6">
        <flux:field>
            <flux:label>National ID</flux:label>
            <flux:input wire:model="nationalId" type="text"/>
            <flux:error name="nationalId"/>
        </flux:field>

        <flux:field>
            <flux:label>Where are you from?</flux:label>
            <flux:select wire:model="country" placeholder="Choose your country of birth...">
                @foreach ($countries as $code => $name)
                    <flux:select.option value="{{ $code }}">{{ $name }}</flux:select.option>
                @endforeach
            </flux:select>
        </flux:field>
    </div>

    <flux:button variant="primary">Update my profile</flux:button>
</form>
