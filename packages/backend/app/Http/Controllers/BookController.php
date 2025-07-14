<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\UpdateBookRequest;
use App\Http\Resources\BookResource;
use App\Models\Book;
use Dedoc\Scramble\Support\Generator\Tag;

#[Tag('Books')]
class BookController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookRequest $request)
    {
        $book = Book::create([
            'name' => $request->validated('name'),
            'isbn' => $request->validated('isbn'),
            'description' => $request->validated('description'),
            'rating' => 0,
            'cover_image_path' => $request->validated('cover_image_path'),
            'author' => $request->validated('author'),
            'num_pages' => $request->validated('num_pages'),
            'edition' => $request->validated('edition'),
            'published_year' => $request->validated('published_year'),
            'added_by' => $request->user()->id,
            'book_status'=> 'waiting-for-approval',
            'is_added_by_system' => false,
        ]);

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
     * Show the form for editing the specified resource.
     */
    public function edit(Book $book)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookRequest $request, Book $book)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book)
    {
        //
    }
}
