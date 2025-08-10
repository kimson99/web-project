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
        Schema::table('reviews', function (Blueprint $table) {
            $table->string('content', 3000)->change();
        });

        DB::statement('ALTER TABLE reviews MODIFY COLUMN id CHAR(36) DEFAULT (UUID())');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->string('content')->change();
        });

        // Remove the UUID default
        DB::statement('ALTER TABLE reviews MODIFY COLUMN id CHAR(36)');
    }
};
