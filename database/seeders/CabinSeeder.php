<?php

namespace Database\Seeders;

use App\Models\Amenity;
use App\Models\Cabin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class CabinSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $imageDir = base_path('public/assets/cabins');
        $cabinImages = collect(File::files($imageDir))
            ->filter(fn($file) => $file->getExtension() === 'webp')
            ->map(fn($file) => $file->getPathname())
            ->values();

        Cabin::factory(10)->create()->each(function (Cabin $cabin) use ($cabinImages) {
            // Upload cabin images
            $numOfImages = rand(1, 5);
            $images = $cabinImages->random($numOfImages);
            foreach ($images as $image) {
                $originalExtension = File::extension($image);
                $fileName = Str::random(10) . '.' . $originalExtension;

                $cabin->addMedia($image)
                    ->preservingOriginal()
                    ->usingFileName($fileName)
                    ->toMediaCollection('cabins');

                $this->command->info("Cabin {$cabin->name} created with image {$image}");
            }

            // TODO: Add related data
            // $cabin->availability()->saveMany(
            //     CabinAvailability::factory()->count(3)->make()
            // );

            $cabin->amenities()->attach(
                Amenity::inRandomOrder()->take(rand(1, 5))->pluck('id')
            );
        });
    }
}
