<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AmenitySeeder::class,
        ]);

        if (app()->environment() !== 'production') {
            $this->call([
                CabinSeeder::class,
            ]);

            User::create([
                'name' => 'Admin User',
                'email' => 'admin@oasis.test',
                'password' => Hash::make('password'),
            ]);
        }
    }
}
