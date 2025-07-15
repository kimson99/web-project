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
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'rating' => $this->rating,
            'cover_image_path' => $this->cover_image_path,
            'author' => $this->author,
            'num_pages' => $this->num_pages,
            'edition' => $this->edition,
            'published_year' => $this->published_year,
            'is_added_by_system' => $this->is_added_by_system,
            'book_status' => $this->book_status,
            'added_by' => $this->added_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
