<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserBookResource extends JsonResource
{
    /**
     * Summary of wrap
     * disable wrapping the response in data
     */
    public static $wrap = null;
    
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'book_id' => $this->book_id,
            'notes' => $this->notes,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'current_page' => $this->current_page,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'book' => [
                'id' => $this->book->id,
                'title' => $this->book->title,
                'description' => $this->book->description,
                'average_rating' => $this->book->average_rating,
                'cover_image_path' => $this->book->cover_image_path,
                'authors' => $this->book->authors->map(function ($author) {
                    return [
                        'id' => $author->id,
                        'name' => $author->name,
                        'avatar_image_path' => $author->avatar_image_path,
                    ];
                }),
                'num_pages' => $this->book->num_pages,
                'published_year' => $this->book->published_year,
                'is_added_by_system' => $this->book->is_added_by_system,
                'book_status' => $this->book->book_status,
                'added_by' => $this->book->added_by,
                'created_at' => $this->book->created_at,
                'updated_at' => $this->book->updated_at,
            ],
        ];
    }
} 