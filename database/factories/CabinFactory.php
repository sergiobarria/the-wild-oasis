<?php

namespace Database\Factories;

use App\Models\Cabin;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Cabin>
 */
class CabinFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->numberBetween(100, 199),
            'price_per_night' => $this->faker->randomFloat(2, 100, 1000),
            'discount_percentage' => $this->faker->boolean(30) ? $this->faker->randomFloat(2, 5, 25) : null,
            'max_guests' => $this->faker->numberBetween(1, 6),
            'summary' => $this->faker->sentence(10),
            'beds' => $this->faker->numberBetween(1, 4),
            'baths' => $this->faker->numberBetween(1, 4),
            'description' => $this->faker->paragraphs(3, true)
        ];
    }
}
