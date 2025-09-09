<?php

namespace App\Livewire\Auth;

use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;
use Livewire\Attributes\Validate;
use Livewire\Component;

class LoginForm extends Component
{
    #[Validate('required|string|email')]
    public string $email;

    #[Validate('required|string')]
    public string $password;

    public bool $remember = false;

    public string $redirectUrl = '';

    public function mount(): void
    {
        $this->redirectUrl = request()->query('redirect', '');
    }

    public function login(): void
    {
        $this->validate();

        $credentials = [
            'email' => $this->email,
            'password' => $this->password
        ];

        if (!Auth::attempt($credentials, $this->remember)) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        session()->regenerate();

        if ($this->redirectUrl && str_starts_with($this->redirectUrl, config('app.url'))) {
            $this->redirect($this->redirectUrl, navigate: true);
            return;
        }

        $this->redirectIntended(route('home', absolute: false), navigate: true);
    }

    public function render(): View
    {
        return view('livewire.auth.login-form');
    }
}
