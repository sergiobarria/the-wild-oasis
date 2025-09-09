<form wire:submit.prevent="register"
      class="w-full max-w-lg space-y-6 p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
    <flux:heading level="1" size="xl" class="text-center">Create New Account</flux:heading>

    <flux:field>
        <flux:label for="name">Tell us your name</flux:label>
        <flux:input wire:model.live.debounce="name" type="text" placeholder="john doe"/>
        <flux:error name="name" class="text-xs italic"/>
    </flux:field>

    <flux:field>
        <flux:label for="email">Tell us your email</flux:label>
        <flux:input wire:model.live.debounce="email" type="email" placeholder="iamawesome@gmail.com"/>
        <flux:error name="email" class="text-xs italic"/>
    </flux:field>

    <flux:field>
        <flux:label for="password">Add a secure password</flux:label>
        <flux:input wire:model.live.debounce="password" type="password" placeholder="*******"/>
        <flux:error name="password" class="text-xs italic"/>
    </flux:field>

    <flux:field>
        <flux:label for="password_confirmation">Add a secure password</flux:label>
        <flux:input wire:model.live.debounce="password_confirmation" type="password" placeholder="*******"/>
        <flux:error name="password_confirmation" class="text-xs italic"/>
    </flux:field>

    <flux:button type="submit" variant="primary" class="w-full">Register</flux:button>
</form>
