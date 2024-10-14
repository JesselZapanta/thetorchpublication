<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

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
            'created_by' => fake()->numberBetween(1, 6),
            'academic_year_id' => fake()->numberBetween(1,5),
            'category_id' => fake()->numberBetween(1, 7),
            'edited_by' => fake()->numberBetween(3, 5),
            'layout_by' => fake()->numberBetween(7,7),
            'published_by' => fake()->numberBetween(1, 2),
            'slug' => Str::slug(fake()->unique()->sentence) . '-' . fake()->unique()->numberBetween(1, 10000),
            'title' => fake()->realText(fake()->numberBetween(10, 100)),
            'excerpt' => fake()->realText(fake()->numberBetween(10, 1000)),
            'body' => fake()->realText(fake()->numberBetween(10, 10000)),
            'caption' => fake()->realText(fake()->numberBetween(10, 300)),
            'status' => 'published',
            
            'submitted_at' => fake()->dateTimeBetween('-1 year', 'now'), 
            'edited_at' => fake()->dateTimeBetween('-1 year', 'now'), 
            'published_date' => fake()->dateTimeBetween('-1 year', 'now'), 
        ];
    }
}
