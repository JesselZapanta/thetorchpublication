<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Article>
 */
class ArticleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'created_by' => fake()->numberBetween(1, 10),
            'academic_year_id' => 1,
            'category_id' => fake()->numberBetween(1, 5),
            'edited_by' => 1,
            'layout_by' => 1,
            'slug' => 'this-is-a-sample-slug',
            'title' => fake()->realText(fake()->numberBetween(10, 100)),
            'excerpt' => fake()->realText(fake()->numberBetween(10, 1000)),
            'body' => fake()->realText(fake()->numberBetween(10, 10000)),
            'caption' => fake()->realText(fake()->numberBetween(10, 300)),
            'status' => 'published',
            'published_date' => now(),
        ];
    }
}
