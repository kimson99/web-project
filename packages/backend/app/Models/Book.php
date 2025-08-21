<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    /** @use HasFactory<\Database\Factories\BookFactory> */
    use HasFactory, HasUuids;
    /**
     * The data type of the primary key ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'isbn',
        'description',
        'average_rating',
        'cover_image_path',
        'ol_cover_key',
        'num_pages',
        'published_year',
        'is_added_by_system',
        'book_status',
        'added_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'average_rating' => 'float',
        'num_pages' => 'integer',
        'is_added_by_system' => 'boolean',
        'published_year' => 'string',
    ];

    /**
     * Get the user who added the book.
     */
    public function addedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'added_by');
    }

    /**
     * Get the genres for the book.
     */
    public function genres(): BelongsToMany
    {
        return $this->belongsToMany(Genre::class, 'book_genre');
    }

    /**
     * Get the user books for this book.
     */
    public function userBooks(): HasMany
    {
        return $this->hasMany(UserBook::class);
    }

    /**
     * Update the average rating based on reviews.
     */
    public function updateAverageRating(): void
    {
        $averageRating = $this->reviews()->whereNotNull('rating')->avg('rating');
        $this->update(['average_rating' => $averageRating ?? 0]);
    }

    /**
     * Get the authors for the book.
     */
    public function authors(): BelongsToMany
    {
        return $this->belongsToMany(Author::class, 'author_book');
    }

    /**
     * Get the reviews for this book.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get the cover image URL.
     */
    public function getCoverImageUrlAttribute(): ?string
    {
        if ($this->cover_image_path) {
            return config('app.url') . '/api/media/serve/' . $this->cover_image_path;
        }
        
        if ($this->ol_cover_key) {
            return "https://covers.openlibrary.org/b/olid/{$this->ol_cover_key}-M.jpg";
        }
        
        return null;
    }
}
