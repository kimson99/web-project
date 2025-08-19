<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserProfileResource extends JsonResource
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
            'name' => $this->name,
            'avatar_path' => $this->avatar_path,
            'created_at' => $this->created_at,
            'reviews' => ReviewResource::collection($this->whenLoaded('reviews')),
            'reading_stats' => [
                'total_books' => $this->userBooks->count(),
                'books_read' => $this->userBooks->where('status', 'read')->count(),
                'books_reading' => $this->userBooks->where('status', 'reading')->count(),
                'books_want_to_read' => $this->userBooks->where('status', 'want_to_read')->count(),
                'average_rating' => $this->reviews->avg('rating'),
                'total_reviews' => $this->reviews->count(),
            ],
            'recent_activity' => [
                'recent_reviews' => ReviewResource::collection(
                    $this->whenLoaded('reviews', function () {
                        return $this->reviews->sortByDesc('created_at')->take(5);
                    })
                ),
                'recent_books' => UserBookResource::collection(
                    $this->whenLoaded('userBooks', function () {
                        return $this->userBooks->sortByDesc('updated_at')->take(5);
                    })
                ),
            ],
        ];
    }
}