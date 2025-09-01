<form wire:submit.prevent="submit" class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-8">
    <flux:field class="md:col-span-1">
        <flux:label>Name</flux:label>
        <flux:input wire:model.defer="name" name="name" placeholder="Your full name"/>
        <flux:error name="name"/>
    </flux:field>

    <flux:field class="md:col-span-1">
        <flux:label>Email</flux:label>
        <flux:input wire:model.defer="email" type="email" name="email" placeholder="you@example.com"/>
        <flux:error name="email"/>
    </flux:field>

    <flux:field class="md:col-span-2">
        <flux:label>Phone (optional)</flux:label>
        <flux:input wire:model.defer="phone" type="tel" mask="+1 (999) 999-9999" name="phone"
                    placeholder="+1 (234) 567-890"/>
        <flux:error name="phone"/>
    </flux:field>

    <flux:field class="md:col-span-2">
        <flux:label>Subject</flux:label>
        <flux:input wire:model.defer="subject" name="subject" placeholder="Reason for contacting us"/>
        <flux:error name="subject"/>
    </flux:field>

    <div class="md:col-span-2">
        <flux:textarea wire:model.defer="message" name="message" label="Message"
                       placeholder="Type your message here..."/>
    </div>

    <div class="md:col-span-2 text-center">
        <flux:button type="submit" variant="primary" spinner="submit" class="cursor-pointer">
            Send Message
        </flux:button>

        @if ($submitted)
            <p class="mt-4 text-green-500">Your message has been sent. Thank you!</p>
        @endif
    </div>
</form>

