<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE books ADD FULLTEXT INDEX books_fulltext_search (title, description)');
        
        DB::statement('ALTER TABLE authors ADD FULLTEXT INDEX authors_fulltext_search (name)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove full-text search indexes
        DB::statement('ALTER TABLE books DROP INDEX books_fulltext_search');
        DB::statement('ALTER TABLE authors DROP INDEX authors_fulltext_search');
    }
};
