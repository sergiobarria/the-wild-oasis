<?php

namespace Database\Factories;

use App\Models\Cabin;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Cabin>
 */
class CabinFactory extends Factory
{
    protected $model = Cabin::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Cabin ' . $this->faker->numberBetween(1, 100),
            'summary' => $this->faker->sentence(12),
            'description' => $this->faker->paragraphs(3, true),
            'price_per_night' => $this->faker->randomFloat(2, 100, 500),
            'max_guests' => $this->faker->numberBetween(2, 8),
            'bedrooms' => $this->faker->numberBetween(1, 5),
            'bathrooms' => $this->faker->numberBetween(1, 5),
            'published_at' => now()
        ];
    }
}
