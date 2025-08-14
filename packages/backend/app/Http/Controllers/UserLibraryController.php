<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserBookRequest;
use App\Http\Requests\UpdateUserBookRequest;
use App\Http\Requests\IndexUserBookRequest;
use App\Http\Resources\UserBookResource;
use App\Models\UserBook;
use App\Models\Book;
use Dedoc\Scramble\Support\Generator\Tag;

#[Tag('User Library')]
class UserLibraryController
{
    /**
     * Display a listing of the user's library.
     */
    public function index(IndexUserBookRequest $request)
    {
        $userId = auth()->id();
        
        $query = UserBook::with(['book.authors', 'book.genres'])
            ->where('user_id', $userId);

        // Apply status filter
        if ($request->filled('status')) {
            $query->where('status', $request->validated('status'));
        }

        // Apply search
        if ($request->filled('search')) {
            $searchTerm = $request->validated('search');
            
            $query->whereHas('book', function ($bookQuery) use ($searchTerm) {
                $bookQuery->whereRaw('MATCH(title, description) AGAINST(? IN NATURAL LANGUAGE MODE)', [$searchTerm])
                  ->orWhereHas('authors', function ($authorQuery) use ($searchTerm) {
                      $authorQuery->whereRaw('MATCH(name) AGAINST(? IN NATURAL LANGUAGE MODE)', [$searchTerm]);
                  });
            });
        }

        // Apply pagination
        $skip = $request->validated('skip', 0);
        $take = $request->validated('take', 20);

        $userBooks = $query->skip($skip)->take($take)->get();
        $total = $query->count();

        return UserBookResource::collection($userBooks)->additional([
            'meta' => [
                'total' => $total,
                'skip' => $skip,
                'take' => $take,
                'has_more' => ($skip + $take) < $total,
            ]
        ]);
    }

    /**
     * Store a newly created user book in storage.
     */
    public function store(StoreUserBookRequest $request)
    {
        $userId = auth()->id();
        
        $existingUserBook = UserBook::where('user_id', $userId)
            ->where('book_id', $request->validated('book_id'))
            ->first();

        if ($existingUserBook) {
            return response()->json([
                'message' => 'Book is already in your library.',
                'user_book' => new UserBookResource($existingUserBook)
            ], 409);
        }

        $userBook = UserBook::create([
            'user_id' => $userId,
            'book_id' => $request->validated('book_id'),
            'notes' => $request->validated('notes', ''),
            'start_date' => $request->validated('start_date'),
            'current_page' => $request->validated('current_page', 0),
            'status' => $request->validated('status', 'want-to-read'),
        ]);

        $userBook->load(['book.authors', 'book.genres']);

        return new UserBookResource($userBook);
    }

    /**
     * Display the specified user book.
     */
    public function show(UserBook $userBook)
    {
        if ($userBook->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $userBook->load(['book.authors', 'book.genres']);

        return new UserBookResource($userBook);
    }

    /**
     * Update the specified user book in storage.
     */
    public function update(UpdateUserBookRequest $request, UserBook $userBook)
    {
        if ($userBook->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $userBook->update($request->validated());
        $userBook->load(['book.authors', 'book.genres']);

        return new UserBookResource($userBook);
    }

    /**
     * Remove the specified user book from storage.
     */
    public function destroy(UserBook $userBook)
    {
        if ($userBook->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $userBook->delete();

        return response()->json(['message' => 'Book removed from library successfully']);
    }
} 