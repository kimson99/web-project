<?php

namespace Database\Seeders;

use App\Models\Review;
use App\Models\User;
use App\Models\Book;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing users and books to ensure we have valid relationships
        $users = User::all();
        $books = Book::all();

        // If no users or books exist, create some first
        if ($users->isEmpty()) {
            $users = User::factory(50)->create();
        }

        if ($books->isEmpty()) {
            $books = Book::factory(20)->create();
        }

        // Create 100 reviews
        Review::factory(100)->create([
            'user_id' => function () use ($users) {
                return $users->random()->id;
            },
            'book_id' => function () use ($books) {
                return $books->random()->id;
            },
        ]);

        $this->command->info('100 reviews have been created successfully!');
    }
} 