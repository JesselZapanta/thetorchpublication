<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FreedomWall>
 */
class FreedomWallFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => 1,
            'body' => fake()->realText(fake()->numberBetween(10, 500)),
            'emotion' => fake()->randomElement(['happy', 'sad', 'annoyed', 'proud', 'drained', 'inlove', 'calm', 'excited', 'angry', 'down']), // Random emotion
            'created_at' => fake()->dateTimeBetween('-1 year', 'now'), 
            'updated_at' => fake()->dateTimeBetween('-1 year', 'now'), 
        ];
    }
}
