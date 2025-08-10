<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\UpdateBookRequest;
use App\Http\Requests\IndexBookRequest;
use App\Http\Resources\BookResource;
use App\Models\Book;
use App\Models\Author;
use App\Models\Genre;
use Dedoc\Scramble\Support\Generator\Tag;

#[Tag('Books')]
class BookController
{
    /**
     * Display a listing of the resource.
     */
    public function index(IndexBookRequest $request)
    {
        $query = Book::with(['authors', 'genres']);

        // Apply search
        if ($request->filled('search')) {
            $searchTerm = $request->validated('search');
            
            $query->where(function ($q) use ($searchTerm) {
                // Search in books table (title and description)
                $q->whereRaw('MATCH(title, description) AGAINST(? IN NATURAL LANGUAGE MODE)', [$searchTerm])
                  ->orWhereHas('authors', function ($authorQuery) use ($searchTerm) {
                      // Search in authors table (name)
                      $authorQuery->whereRaw('MATCH(name) AGAINST(? IN NATURAL LANGUAGE MODE)', [$searchTerm]);
                  });
            });
        }

        // Apply genre filtering
        if ($request->filled('genres')) {
            $genres = $request->validated('genres');
            $query->whereHas('genres', function ($genreQuery) use ($genres) {
                $genreQuery->whereIn('name', $genres);
            });
        }

        // Apply sorting
        $sortBy = $request->validated('sort_by', 'created_at');
        $sortOrder = $request->validated('sort_order', 'desc');
        
        // Handle special sorting cases
        if ($sortBy === 'average_rating') {
            $query->orderBy('average_rating', $sortOrder);
        } elseif ($sortBy === 'published_year') {
            $query->orderBy('published_year', $sortOrder);
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Apply pagination
        $skip = $request->validated('skip', 0);
        $take = $request->validated('take', 20);

        $books = $query->skip($skip)->take($take)->get();
        $total = $query->count();

        // If user is authenticated, load additional user-specific data
        if (auth()->check()) {
            $userId = auth()->id();
            
            $books->load([
                'userBooks' => function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                },
                'userRatings' => function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                }
            ]);
        }

        return BookResource::collection($books)->additional([
            'meta' => [
                'total' => $total,
                'skip' => $skip,
                'take' => $take,
                'has_more' => ($skip + $take) < $total,
                'authenticated' => auth()->check(),
                'filters' => [
                    'search' => $request->validated('search'),
                    'genres' => $request->validated('genres'),
                    'sort_by' => $sortBy,
                    'sort_order' => $sortOrder,
                ]
            ]
        ]);
    }

    /**
     * Get available genres for filtering.
     */
    public function genres()
    {
        $genres = Genre::orderBy('name')->get(['id', 'name']);
        
        return response()->json([
            'genres' => $genres
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookRequest $request)
    {
        $book = Book::create([
            'title' => $request->validated('title'),
            'isbn' => $request->validated('isbn'),
            'description' => $request->validated('description'),
            'average_rating' => 0,
            'cover_image_path' => $request->validated('cover_image_path'),
            'num_pages' => $request->validated('num_pages'),
            'published_year' => $request->validated('published_year'),
            'added_by' => $request->user()->id,
            'book_status'=> 'waiting-for-approval',
            'is_added_by_system' => false,
        ]);

        // Handle authors - create or find existing authors and attach to book
        $authors = $request->validated('authors');
        foreach ($authors as $authorName) {
            $author = Author::firstOrCreate(['name' => $authorName]);
            $book->authors()->attach($author->id);
        }

        return new BookResource($book);
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book)
    {
        return new BookResource($book);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookRequest $request, Book $book)
    {
        $book->update($request->validated());

        // Handle authors if provided
        if ($request->has('authors')) {
            // Detach existing authors
            $book->authors()->detach();
            
            // Attach new authors
            $authors = $request->validated('authors');
            foreach ($authors as $authorName) {
                $author = Author::firstOrCreate(['name' => $authorName]);
                $book->authors()->attach($author->id);
            }
        }

        return new BookResource($book);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book)
    {
        $book->delete();

        return response()->json(['message' => 'Book deleted successfully']);
    }
}
