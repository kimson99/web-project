<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'average_rating' => $this->average_rating,
            'cover_image_path' => $this->cover_image_path,
            'authors' => $this->authors->map(function ($author) {
                return [
                    'id' => $author->id,
                    'name' => $author->name,
                    'avatar_image_path' => $author->avatar_image_path,
                ];
            }),
            'num_pages' => $this->num_pages,
            'published_year' => $this->published_year,
            'is_added_by_system' => $this->is_added_by_system,
            'book_status' => $this->book_status,
            'added_by' => $this->added_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];

        // Add user-specific information if authenticated
        if (auth()->check()) {
            $userBook = $this->userBooks->first();
            $userRating = $this->userRatings->first();
              
            $data['user_data'] = $userBook ? [
                'reading_status' => $userBook->status ? $userBook->status : null,
                'current_page' => $userBook->current_page ? $userBook->current_page : null,
                'notes' => $userBook->notes ? $userBook->notes : null,
                'user_rating' => $userRating->rating ? $userRating->rating : null
            ] : null;
        }

        return $data;
    }
}
