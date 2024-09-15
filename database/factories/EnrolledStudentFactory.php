<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EnrolledStudent>
 */
class EnrolledStudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'student_id' => fake()->unique()->numberBetween(100000, 999999), 
            'firstname' => fake()->firstName(), 
            'middelname' => fake()->lastName(), //todo edit nex migtaion
            'lastname' => fake()->lastName(), 
        ];
    }
}
