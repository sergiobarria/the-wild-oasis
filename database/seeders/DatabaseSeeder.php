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
            RoleSeeder::class,
            AmenitySeeder::class,
        ]);

        if (app()->environment() !== 'production') {
            $this->call([
                CabinSeeder::class,
            ]);

            User::create([
                'email' => 'admin@oasis.test',
                'password' => Hash::make('password'),
            ]);
        }
    }
}
