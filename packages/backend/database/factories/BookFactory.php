<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class BookFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'isbn' => fake()->isbn13(),
            'name' => fake()->name(),
            'description' => fake()->paragraph(),
            'average_rating' => fake()->randomDigitNotZero(),
            'cover_image_path' => fake()->filePath(),
            'author' => fake()->name(),
            'num_pages' => fake()->randomNumber(300),
            'edition' => fake()->randomLetter(),
            'published_year' => fake()->year(),
            'is_added_by_system' => fake()->boolean(),
            'book_status' => fake()->randomElement(["approved", 'waiting-for-approval']),
        ];
    }
}
