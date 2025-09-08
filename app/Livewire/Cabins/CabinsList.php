<?php

namespace App\Livewire\Cabins;

use App\Models\Cabin;
use Illuminate\View\View;
use Livewire\Attributes\Url;
use Livewire\Component;

class CabinsList extends Component
{
    const DEFAULT_PER_PAGE = 10;

    #[Url]
    public string $search = '';

    public function render(): View
    {
        $cabins = Cabin::with(['media' => function ($query) {
            $query->where('collection_name', 'cabins');
        }])
            ->when($this->search, function ($query) {
                $query->where('name', 'like', '%' . $this->search . '%');
            })
            ->paginate(self::DEFAULT_PER_PAGE);

        ds($cabins);
        return view('livewire.cabins.cabins-list', [
            'cabins' => $cabins,
        ]);
    }
}
