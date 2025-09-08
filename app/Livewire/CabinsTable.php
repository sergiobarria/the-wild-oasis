<?php

namespace App\Livewire;

use App\Models\Cabin;
use Flux\Flux;
use Illuminate\View\View;
use Livewire\Component;
use Livewire\WithPagination;

class CabinsTable extends Component
{
    use WithPagination;

    const DEFAULT_PER_PAGE = 10;

    public string $search = '';

    public function deleteCabin(string $cabinId): void
    {
        $cabin = Cabin::find($cabinId);

        if ($cabin) {
            $cabin->delete();
            Flux::toast(text: 'Cabin deleted successfully.', heading: 'Changes saved.', variant: 'success');
        } else {
            Flux::toast(text: 'There was an error while deleting the cabin.', heading: 'Changes failed.', variant: 'danger');
        }
    }

    public function render(): View
    {
        $cabins = Cabin::query()
            ->with(['media' => function ($query) {
                $query->where('collection_name', 'cabins');
            }])
            ->when($this->search, function ($query) {
                $query->where('name', 'like', '%' . $this->search . '%')
                    ->orWhere('summary', 'like', '%' . $this->search . '%')
                    ->orWhere('description', 'like', '%' . $this->search . '%');
            })
            ->orderBy('created_at', 'desc')
            ->paginate(self::DEFAULT_PER_PAGE);

        return view('livewire.cabins-table', [
            'cabins' => $cabins
        ]);
    }
}
