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
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'content' => $this->content,
            'user_id' => $this->user_id,
            'book_id' => $this->book_id,
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                    'avatar_path' => $this->user->avatar_path,
                    'rating' => $this->book->userRatings?->first()?->rating ?? 0
                ];
            }),
            'book' => $this->whenLoaded('book', function () {
                return [
                    'id' => $this->book->id,
                    'title' => $this->book->title,
                    'cover_image_url' => $this->book->cover_image_url,
                    'authors' => $this->when($this->book->relationLoaded('authors'), function () {
                        return $this->book->authors->map(function ($author) {
                            return [
                                'id' => $author->id,
                                'name' => $author->name,
                            ];
                        });
                    })
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
} 