<?php

namespace App\Livewire;

use App\Mail\WelcomeEmail;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\View\View;
use Livewire\Attributes\Validate;
use Livewire\Component;

class RegisterForm extends Component
{
    #[Validate('required|string|max:255')]
    public string $name = '';

    #[Validate('required|email|unique:users,email')]
    public string $email = '';

    #[Validate('required|string|min:8|confirmed')]
    public string $password = '';

    #[Validate('required|string|min:8')]
    public string $password_confirmation = '';

    public function register()
    {
        $this->validate();

        $user = User::create([
            'email' => $this->email,
            'password' => Hash::make($this->password),
        ]);

        $user->assignRole('user');

        $user->profile()->create([
            'user_id' => $user->id,
            'name' => $this->name,
        ]);

        Auth::login($user);

        Mail::to($user->email)->queue(new WelcomeEmail($user));

        return redirect()->route('account.index');
    }

    public function render(): View
    {
        return view('livewire.register-form');
    }
}
