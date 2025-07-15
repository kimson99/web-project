<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use Dedoc\Scramble\Support\Generator\Tag;

#[Tag('Reviews')]
class ReviewController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reviews = Review::with(['user', 'book'])->paginate(15);
        return ReviewResource::collection($reviews);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReviewRequest $request)
    {
        $review = Review::create([
            'user_id' => $request->user()->id,
            'book_id' => $request->validated('book_id'),
            'content' => $request->validated('content'),
        ]);

        return new ReviewResource($review->load(['user', 'book']));
    }

    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
        return new ReviewResource($review->load(['user', 'book']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReviewRequest $request, Review $review)
    {
        // Check if user owns the review
        if ($review->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $review->update([
            'content' => $request->validated('content'),
        ]);

        return new ReviewResource($review->load(['user', 'book']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
        // Check if user owns the review
        if ($review->user_id !== auth()->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $review->delete();

        return response()->json(['message' => 'Review deleted successfully']);
    }
} 