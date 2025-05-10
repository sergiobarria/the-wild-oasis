<?php

namespace App\Livewire;

use App\Models\ContactMessage;
use Illuminate\View\View;
use Livewire\Attributes\Validate;
use Livewire\Component;

class ContactForm extends Component
{
    #[Validate('required|string|min:3')]
    public string $name = '';

    #[Validate('required|email')]
    public string $email = '';

    #[Validate('nullable|string')]
    public ?string $phone = '';

    #[Validate('required|string|min:5')]
    public string $subject = '';

    #[Validate('required|string|min:10')]
    public string $message = '';
    public bool $submitted = false;

    public function submit(): void
    {
        $validated = $this->validate();
        ray($validated);

        ContactMessage::create($validated);

        $this->reset(['name', 'email', 'phone', 'subject', 'message']);
        $this->submitted = true;
    }

    public function render(): View
    {
        return view('livewire.contact-form');
    }
}
