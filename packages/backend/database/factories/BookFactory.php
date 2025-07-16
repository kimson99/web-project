<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Author;

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
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'average_rating' => fake()->randomDigitNotZero(),
            'cover_image_path' => fake()->filePath(),
            'num_pages' => fake()->randomNumber(300),
            'published_year' => fake()->year(),
            'is_added_by_system' => fake()->boolean(),
            'book_status' => fake()->randomElement(["approved", 'waiting-for-approval']),
        ];
    }

    /**
     * Configure the model factory.
     */
    public function configure()
    {
        return $this->afterCreating(function ($book) {
            // Create and attach a random author
            $author = Author::factory()->create();
            $book->authors()->attach($author->id);
        });
    }
}
