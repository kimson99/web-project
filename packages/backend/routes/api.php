<?php


use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserLibraryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// Public routes (no authentication required)
Route::prefix('auth')->name('auth.')->group(function() {
    Route::post("/login", [AuthController::class, 'authenticate']);
    Route::post("/register", [AuthController::class, 'create']);
    Route::post("/forgot-password", [AuthController::class, 'forgotPassword']);
    Route::post("/reset-password", [AuthController::class, 'resetPassword']);
})->middleware("guest");

// Public book browsing
Route::get('/books', [BookController::class, 'index']);
Route::get('/books/genres', [BookController::class, 'genres']);

// Public review browsing
Route::get('/reviews', [ReviewController::class, 'index']);
Route::get('/reviews/{review}', [ReviewController::class, 'show']);

// Protected routes (authentication required)
Route::middleware("auth:sanctum")->group(function() {
    // User management
    Route::prefix('auth')->name('auth.')->group(function() {
        Route::get('/me', [AuthController::class, 'getMe']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // Books (admin operations)
    Route::prefix('books')->name('books.')->middleware('admin')->group(function() {
        Route::post('/', [BookController::class, 'store']);
        Route::put('/{book}', [BookController::class, 'update']);
        Route::delete('/{book}', [BookController::class, 'destroy']);
    });

    Route::prefix('books')->name('books.')->group(function() {
        Route::get('/{book}', [BookController::class, 'show']);
    });

    // Media
    Route::prefix('media')->name('media.')->group(function() {
        Route::post('/upload-image', [MediaController::class, 'uploadImage']);
        Route::get('/serve/{path}', [MediaController::class, 'serveImage'])->where('path', '.*');
    });

    // Reviews (authenticated operations)
    Route::prefix('reviews')->name('reviews.')->group(function() {
        Route::post('/', [ReviewController::class, 'store']);
        Route::put('/{review}', [ReviewController::class, 'update']);
        Route::delete('/{review}', [ReviewController::class, 'destroy']);
    });

    // User Library
    Route::prefix('library')->name('library.')->group(function() {
        Route::get('/', [UserLibraryController::class, 'index']);
        Route::post('/', [UserLibraryController::class, 'store']);
        Route::get('/{userBook}', [UserLibraryController::class, 'show']);
        Route::put('/{userBook}', [UserLibraryController::class, 'update']);
        Route::delete('/{userBook}', [UserLibraryController::class, 'destroy']);
    });
});

