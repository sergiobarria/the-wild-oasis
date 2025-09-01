<?php

namespace Database\Seeders;

use App\Models\Amenity;
use App\Models\Cabin;
use App\Models\CabinAvailability;
use App\Models\Review;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class CabinSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $imageDir = base_path('public/images/cabins');
        $imageFiles = collect(File::files($imageDir))
            ->filter(fn($f) => $f->getExtension() === 'webp')
            ->map(fn($f) => $f->getPathname())
            ->values();

        Cabin::factory(10)->create()->each(function ($cabin) use ($imageFiles) {
            $main = $imageFiles->random();
            $cabin->addMedia($main)->preservingOriginal()->toMediaCollection('images');

            $gallery = $imageFiles->reject(fn($f) => $f === $main)->random(4);
            foreach ($gallery as $img) {
                $cabin->addMedia($img)->preservingOriginal()->toMediaCollection('images');
            }

            $cabin->availability()->saveMany(
                CabinAvailability::factory()->count(3)->make()
            );

            $cabin->amenities()->attach(
                Amenity::inRandomOrder()->take(3)->pluck('id')
            );

            $cabin->reviews()->saveMany(
                Review::factory()->count(rand(1, 5))->make()
            );
        });
    }
}
