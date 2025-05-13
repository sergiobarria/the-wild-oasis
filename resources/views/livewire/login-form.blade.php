<form wire:submit.prevent="register" class="space-y-4 w-full">
    <flux:field>
        <flux:label>What about your Email</flux:label>
        <flux:input wire:model="email" type="email" placeholder="iamawesome@email.com"/>
        <flux:error name="email"/>
    </flux:field>

    <flux:field>
        <flux:label>Your password</flux:label>
        <flux:input wire:model="password" type="password" placeholder="**********"/>
        <flux:error name="password"/>
    </flux:field>

    <flux:button type="submit" variant="primary" class="w-full">Sign In</flux:button>
</form>

