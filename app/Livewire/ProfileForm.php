<?php

namespace App\Livewire;

use Livewire\Component;
use Nnjeim\World\Models\Country;

class ProfileForm extends Component
{
    public array $countries = [];

    public function mount(): void
    {
        $this->countries = Country::query()
            ->orderBy('countries.name', 'asc')
            ->pluck('name', 'id')
            ->toArray();
    }

    public function render()
    {
        return view('livewire.profile-form');
    }
}
