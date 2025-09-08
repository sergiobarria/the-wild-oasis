<?php

namespace App\Livewire;

use App\Models\NewsletterSubscriber;
use Illuminate\View\View;
use Livewire\Attributes\Validate;
use Livewire\Component;

class Newsletter extends Component
{
    #[Validate('required|email|unique:newsletter_subscribers,email')]
    public string $email = '';

    public function submit(): void
    {
        $this->validate();

        NewsletterSubscriber::create([
            'email' => $this->email,
            'subscribe_at' => now()
        ]);

        // TODO: Send welcome to newsletter email

        $this->reset('email');

        session()->flash('success', 'Thanks for signing up!');
    }

    public function render(): View
    {
        return view('livewire.newsletter');
    }
}
