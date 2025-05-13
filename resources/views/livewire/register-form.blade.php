<form wire:submit.prevent="register" class="space-y-4 w-full">
    <flux:field>
        <flux:label>Tell us your name</flux:label>
        <flux:input wire:model="name" type="text"/>
        <flux:error name="name"/>
    </flux:field>

    <flux:field>
        <flux:label>What about your Email</flux:label>
        <flux:input wire:model="email" type="email"/>
        <flux:error name="email"/>
    </flux:field>

    <flux:field>
        <flux:label>Please add a secure password</flux:label>
        <flux:input wire:model="password" type="password"/>
        <flux:error name="password"/>
    </flux:field>

    <flux:field>
        <flux:label>That password again</flux:label>
        <flux:input wire:model="password_confirmation" type="password"/>
        <flux:error name="password_confirmation"/>
    </flux:field>

    <flux:button type="submit" variant="primary" class="w-full cursor-pointer">Create account</flux:button>
</form>

