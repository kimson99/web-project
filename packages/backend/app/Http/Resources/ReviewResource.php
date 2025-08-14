<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    /**
     * Summary of wrap
     * disable wrapping the response in data
     */
    public static $wrap = null;
    
    /**
     * Transform the resource into an array.
     *
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'content' => $this->content,
            'rating' => $this->rating,
            'user_id' => $this->user_id,
            'book_id' => $this->book_id,
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                    'avatar_path' => $this->user->avatar_path,
                ];
            }),
            'book' => $this->whenLoaded('book', function () {
                return [
                    'id' => $this->book->id,
                    'title' => $this->book->title,
                    'cover_image_url' => $this->book->cover_image_url,
                    'authors' => $this->when($this->book->relationLoaded('authors'), function () {
                        return AuthorResource::collection($this->book->authors);
                    })
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
} 