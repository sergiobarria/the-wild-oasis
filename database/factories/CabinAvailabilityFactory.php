<?php

namespace Database\Factories;

use App\Models\CabinAvailability;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CabinAvailability>
 */
class CabinAvailabilityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start_date = now()->addDays(rand(10, 60));

        return [
            'start_date' => $start_date,
            'end_date' => $start_date->addDays(rand(1, 7)),
            'is_available' => false
        ];
    }
}
