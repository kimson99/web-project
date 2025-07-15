<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create("genres", function (Blueprint $table) {
            $table->uuid("id")->primary(); 
            $table->string("name");
            $table->timestamps();
        });


        Schema::create('books', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->string('title');
            $table->string("isbn")->nullable();
            $table->string('description');
            $table->float('average_rating', 1)->default(0);
            $table->string('cover_image_path');
            $table->string('author');
            $table->integer('num_pages');
            $table->string('edition');
            $table->string('published_year');
            $table->boolean('is_added_by_system');
            $table->enum("book_status", ["approved", 'waiting-for-approval']);

          
            $table->foreignUuid('added_by')->constrained('users')->nullable();
            $table->timestamps();
        });

        Schema::create("book_genre", function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignUuid('genre_id')->constrained('genres');
            $table->foreignUuid('book_id')->constrained('books');
            $table->timestamps();
        });

        Schema::create("user_book_rating", function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignUuid('user_id')->constrained('users');
            $table->foreignUuid('book_id')->constrained('books');
            $table->smallInteger('rating');
            $table->timestamps();
        });

        Schema::create("user_books", function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignUuid('user_id')->constrained('users');
            $table->foreignUuid('book_id')->constrained('books');
            $table->string('notes')->default("");
            $table->timestampTz("start_date")->default(now());
            $table->timestampTz("end_date")->default(now());
            $table->integer("current_page")->default(0);
            $table->enum("status", ["want-to-read", "reading", "finished"]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("user_book_log");
        Schema::dropIfExists("user_book_rating");
        Schema::dropIfExists("book_genre");
        Schema::dropIfExists("books");
        Schema::dropIfExists("genres");
    }
};
