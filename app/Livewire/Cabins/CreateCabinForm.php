<?php

namespace App\Livewire\Cabins;

use App\Models\Cabin;
use Flux\Flux;
use Illuminate\View\View;
use Livewire\Attributes\Validate;
use Livewire\Component;
use Livewire\WithFileUploads;

class CreateCabinForm extends Component
{
    use WithFileUploads;

    #[Validate('required|min:3|max:255')]
    public string $name = '';

    #[Validate('required|numeric')]
    public float $price_per_night = 0.00;

    #[Validate('nullable|numeric|min:0|max:100')]
    public ?float $discount_percentage = null;

    #[Validate('nullable|integer|min:1|max:100')]
    public int $max_guests = 1;

    #[Validate('required|integer|min:1|max:10')]
    public int $beds = 1;

    #[Validate('required|integer|min:1|max:10')]
    public int $baths = 1;

    #[Validate('required')]
    public string $summary = '';

    public ?string $description = '';

    #[Validate(["images" => ["array", "max:10"]])]
    #[Validate(["images.*" => ["image", "mimes:jpg,bmp,png"]], message: ['The file field must be a file of type: .PNG, .JPG, .JPEG or .WEBP'])]
    public $images = [];

    public function submit(): null
    {
        try {
            $cabin = Cabin::create(
                $this->only(['name', 'price_per_night', 'discount_percentage', 'max_guests', 'beds', 'baths', 'summary', 'description'])
            );

            // Upload images if any
            if (!empty($this->images)) {
                foreach ($this->images as $image) {
                    $cabin->addMedia($image->getRealPath())
                        ->usingFileName($image->hashName())
                        ->toMediaCollection('cabins');
                }
            }

            Flux::toast(text: 'Cabin successfully create.', heading: 'Success!', variant: 'success');
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            Flux::toast(text: 'Something went wrong.', heading: 'Oops!', variant: 'error');
        }

        return $this->redirect('/admin/cabins');
    }

    public function render(): View
    {
        return view('livewire.cabins.create-cabin-form');
    }
}
