<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Genre>
 */
class GenreFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement([
                'Adventure', 'Art', 'Biography', 'Business', 'Children',
                'Comedy', 'Cooking', 'Crime', 'Drama', 'Fantasy',
                'Fiction', 'History', 'Horror', 'Mystery', 'Non-Fiction',
                'Philosophy', 'Poetry', 'Religion', 'Romance', 'Science Fiction',
                'Self-Help', 'Technology', 'Thriller', 'Travel', 'Young Adult'
            ]),
        ];
    }
}
