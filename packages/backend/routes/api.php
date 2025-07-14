<?php


use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\MediaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// Public routes (no authentication required)
Route::prefix('auth')->name('auth.')->group(function() {
    Route::post("/login", [AuthController::class, 'authenticate']);
    Route::post("/register", [AuthController::class, 'create']);
    Route::post("/forgot-password", [AuthController::class, 'forgotPassword']);
    Route::post("/reset-password", [AuthController::class, 'resetPassword']);
})->middleware("guest");

// Protected routes (authentication required)
Route::middleware("auth:sanctum")->group(function() {
    // User management
    Route::prefix('auth')->name('auth.')->group(function() {
        Route::get('/me', [AuthController::class, 'getMe']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // Books
    Route::prefix('books')->name('books.')->group(function() {
        Route::get('/', [BookController::class, 'index']);
        Route::post('/', [BookController::class, 'store']);
        Route::get('/{book}', [BookController::class, 'show']);
        Route::put('/{book}', [BookController::class, 'update']);
        Route::delete('/{book}', [BookController::class, 'destroy']);
    });

    // Media
    Route::prefix('media')->name('media.')->group(function() {
        Route::post('/upload-image', [MediaController::class, 'uploadImage']);
        Route::get('/serve/{path}', [MediaController::class, 'serveImage'])->where('path', '.*');
    });
});

