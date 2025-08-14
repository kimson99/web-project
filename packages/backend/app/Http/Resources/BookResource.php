<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property string $id
 * @property string $title
 * @property string $description
 * @property float $average_rating
 * @property string|null $cover_image_url
 * @property array<array{id: string, name: string, avatar_image_path: string|null}> $authors
 * @property int $num_pages
 * @property string $published_year
 * @property bool $is_added_by_system
 * @property string $book_status
 * @property string|null $added_by
 * @property string $created_at
 * @property string $updated_at
 */
class BookResource extends JsonResource
{
    /**
     * Summary of wrap
     * disable wrapping the response in data
     */
    public static $wrap = null;
    
    /**
     * Transform the resource into an array.
     *
     * @return array{
     *     id: string,
     *     title: string,
     *     description: string,
     *     average_rating: float,
     *     cover_image_url: string|null,
     *     authors: array<int, array{id: string, name: string, avatar_image_path: string|null}>,
     *     num_pages: int,
     *     published_year: string,
     *     is_added_by_system: bool,
     *     book_status: string,
     *     added_by: string|null,
     *     created_at: string,
     *     updated_at: string,
     *     user_data: array{reading_status: string|null, current_page: int|null, notes: string|null}|null
     * }
     */
    public function toArray(Request $request): array
    {
        $userBook = auth()->check() ? $this->userBooks->first() : null;
        
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'average_rating' => $this->average_rating,
            'cover_image_url' => $this->getCoverImageUrlAttribute(),
            'authors' => AuthorResource::collection($this->authors),
            'num_pages' => $this->num_pages,
            'published_year' => $this->published_year,
            'is_added_by_system' => $this->is_added_by_system,
            'book_status' => $this->book_status,
            'added_by' => $this->added_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user_data' => $userBook ? [
                'id' => $userBook->id,
                'reading_status' => $userBook->status,
                'current_page' => $userBook->current_page,
                'notes' => $userBook->notes
            ] : null,
        ];
    }
}
