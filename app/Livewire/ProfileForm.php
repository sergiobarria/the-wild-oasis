<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;
use Livewire\Component;
use Nnjeim\World\Models\Country;

class ProfileForm extends Component
{
    public string $name = '';

    public string $email = '';

    public ?string $nationalId = null;

    public ?string $nationality = null;

    public array $countries = [];

    public function rules(): array
    {
        return [
            'name' => 'required|string|min:2',
            'email' => 'required|email',
            'nationalId' => 'nullable|string|max:20',
            'nationality' => 'required|string|in:' . implode(',', array_keys($this->countries)),
        ];
    }

    public function mount(): void
    {
        $user = Auth::user();
        $profile = $user->profile;

        $this->name = $profile->name;
        $this->email = $user->email;
        $this->nationalId = $profile->national_id;
        $this->nationality = $profile->nationality;

        $this->countries = Country::orderBy('name')
            ->pluck('name', 'name')
            ->toArray();
    }

    public function update(): void
    {
        $this->validate();

        $user = Auth::user();
        $user->update(['email' => $this->email]);

        $user->profile->update([
            'name' => $this->name,
            'national_id' => $this->nationalId,
            'nationality' => $this->nationality,
        ]);

        session()->flash('success', 'Profile updated successfully.');
    }

    public function render(): View
    {
        return view('livewire.profile-form');
    }
}
