<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call seeders needed in all environments
        $this->call([
            AmenitySeeder::class
        ]);

        if (app()->environment() == 'local') {
            $this->call([
                CabinSeeder::class,
                // Add other seeders
            ]);
        }
    }
}
