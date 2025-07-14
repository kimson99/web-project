<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadImageRequest;
use App\Http\Resources\ApiResponse;
use Dedoc\Scramble\Support\Generator\Operation;
use Dedoc\Scramble\Support\Generator\Response as ScrambleResponse;
use Dedoc\Scramble\Support\Generator\Tag;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

#[Tag('Media')]
class MediaController extends Controller
{
    #[Operation(
        summary: 'Upload image',
        description: 'Upload an image file with a maximum size of 5MB'
    )]
    #[ScrambleResponse(
        status: 200,
        description: 'Image uploaded successfully'
    )]
    #[ScrambleResponse(
        status: 422,
        description: 'Validation failed'
    )]
    #[ScrambleResponse(
        status: 500,
        description: 'Upload failed'
    )]
    public function uploadImage(UploadImageRequest $request)
    {
        try {
            $file = $request->file('image');
            $fileName = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            
            // Store the file in the public/images directory
            $path = $file->storeAs('images', $fileName, 'public');
            
            if (!$path) {
                return ApiResponse::error('Failed to upload image', 500);
            }
            
            // Return the public URL of the uploaded image
            $url = Storage::disk('public')->url($path);
            
            return ApiResponse::success([
                'url' => $url,
                'path' => $path,
                'filename' => $fileName,
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
            ], 'Image uploaded successfully');
            
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to upload image: ' . $e->getMessage(), 500);
        }
    }

    #[Operation(
        summary: 'Serve image by path',
        description: 'Retrieve an image file by its storage path'
    )]
    #[ScrambleResponse(
        status: 200,
        description: 'Image file returned successfully'
    )]
    #[ScrambleResponse(
        status: 404,
        description: 'Image not found'
    )]
    public function serveImage(Request $request, $path)
    {
        // Ensure the path is within the images directory for security
        if (!str_starts_with($path, 'images/')) {
            return ApiResponse::error('Invalid image path', 400);
        }

        // Check if the file exists in storage
        if (!Storage::disk('public')->exists($path)) {
            return ApiResponse::error('Image not found', 404);
        }

        // Get the file path
        $filePath = Storage::disk('public')->path($path);
        
        // Get the mime type
        $mimeType = File::mimeType($filePath);
        
        // Check if it's an image
        if (!str_starts_with($mimeType, 'image/')) {
            return ApiResponse::error('File is not an image', 400);
        }

        // Return the image file as a response
        return response()->file($filePath, [
            'Content-Type' => $mimeType,
            'Cache-Control' => 'public, max-age=31536000', // Cache for 1 year
        ]);
    }
} 