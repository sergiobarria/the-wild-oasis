<div>
    <form wire:submit.prevent="submit" class="flex flex-col sm:flex-row gap-4 mt-6">
        <flux:field class="w-full">
            <flux:input wire:model="email" type="email" placeholder="iamawesome@email.com"/>
            <flux:error name="email" class="text-left"/>
        </flux:field>

        <flux:button type="submit" class="cursor-pointer">
            Subscribe
        </flux:button>
    </form>

    @if (session()->has('success'))
        <div class="mt-4 text-emerald-400 px-4 py-2 rounded-lg text-sm mb-4">
            {{ session('success') }}
        </div>
    @endif
</div>
