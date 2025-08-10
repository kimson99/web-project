<?php

namespace App\Http\Controllers;

use App\Http\Requests\IndexReviewRequest;
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
    public function index(IndexReviewRequest $request)
    {
        $query = Review::with(['user', 'book']);
        
        // Filter by book_id if provided
        if ($request->validated('book_id')) {
            $query->where('book_id', $request->validated('book_id'));
        }
        
        // Handle sorting with defaults
        $sortBy = $request->validated('sort_by') ?? $request->defaults()['sort_by'];
        $sortOrder = $request->validated('sort_order') ?? $request->defaults()['sort_order'];
        $query->orderBy($sortBy, $sortOrder);
        
        // Handle skip/take for pagination
        if ($request->validated('skip') !== null && $request->validated('take') !== null) {
            $skip = (int) $request->validated('skip');
            $take = (int) $request->validated('take');
            $reviews = $query->skip($skip)->take($take)->get();
        } else {
            // Default pagination
            $reviews = $query->paginate($request->defaults()['take']);
        }

        // If user is authenticated, load additional user-specific data
        if (auth()->check()) {
            $userId = auth()->id();
            
            // Load user's relationship with the books being reviewed
            $reviews->load([
                'book',
                'book.authors',
                'book.userBooks' => function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                },
                'book.userRatings' => function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                }
            ]);
        }

        return ReviewResource::collection($reviews)->additional([
            'meta' => [
                'authenticated' => auth()->check(),
                'filters' => [
                    'book_id' => $request->validated('book_id'),
                    'sort_by' => $sortBy,
                    'sort_order' => $sortOrder,
                ]
            ]
        ]);
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
        $review->load(['user', 'book']);

        // If user is authenticated, load additional user-specific data
        if (auth()->check()) {
            $userId = auth()->id();
            
            // Load user's relationship with the book being reviewed
            $review->load([
                'book',
                'book.userBooks' => function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                },
                'book.userRatings' => function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                }
            ]);
        }

        return new ReviewResource($review);
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