<?php

namespace App\Http\Controllers;

use App\Http\Requests\IndexAuthorRequest;
use App\Http\Resources\AuthorResource;
use App\Models\Author;
use Illuminate\Routing\Controller;
use Dedoc\Scramble\Support\Generator\Tag;

#[Tag('Authors')]
class AuthorController extends Controller
{
    /**
     * Display a listing of authors.
     */
    public function index(IndexAuthorRequest $request)
    {
        $query = Author::query();

        // Apply search
        if ($request->filled('search')) {
            $searchTerm = $request->validated('search');
            $query->whereRaw('MATCH(name) AGAINST(? IN NATURAL LANGUAGE MODE)', [$searchTerm]);
        }

        // Apply pagination
        $skip = $request->validated('skip', 0);
        $take = $request->validated('take', 20);

        $authors = $query->skip($skip)->take($take)->get();
        $total = $query->count();

        return AuthorResource::collection($authors)->additional([
            'meta' => [
                'total' => $total,
                'skip' => $skip,
                'take' => $take,
                'has_more' => ($skip + $take) < $total,
            ]
        ]);
    }

    /**
     * Display the specified author.
     */
    public function show(Author $author)
    {
        $author->load('books');
        return new AuthorResource($author);
    }
}