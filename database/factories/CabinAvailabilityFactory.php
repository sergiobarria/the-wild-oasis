<?php

namespace Database\Factories;

use App\Models\CabinAvailability;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CabinAvailability>
 */
class CabinAvailabilityFactory extends Factory
{
    protected $model = CabinAvailability::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start = now()->addDays(rand(10, 60));
        $end = (clone $start)->addDays(rand(1, 7));

        return [
            'start_date' => $start,
            'end_date' => $end,
            'is_available' => false
        ];
    }
}
