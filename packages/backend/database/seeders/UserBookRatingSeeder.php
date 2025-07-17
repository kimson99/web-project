<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserBookRating;
use Illuminate\Database\Seeder;

class UserBookRatingSeeder extends Seeder
{
    /**
     * Seed user book ratings.
     */
    public function run(): void
    {
        // Create user book ratings using existing users and books
        // Each user will rate 1-5 random books
        User::all()->each(function ($user) {
            $booksToRate = \App\Models\Book::inRandomOrder()->limit(fake()->numberBetween(1, 5))->get();
            
            foreach ($booksToRate as $book) {
                // Check if this user has already rated this book
                $existingRating = UserBookRating::where('user_id', $user->id)
                    ->where('book_id', $book->id)
                    ->exists();
                
                if (!$existingRating) {
                    UserBookRating::create([
                        'user_id' => $user->id,
                        'book_id' => $book->id,
                        'rating' => fake()->numberBetween(1, 5),
                    ]);
                }
            }
        });
    }
} 