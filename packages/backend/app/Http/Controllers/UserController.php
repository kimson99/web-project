<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\ApiResponse;
use App\Http\Resources\UserResource;
use Dedoc\Scramble\Support\Generator\Operation;
use Dedoc\Scramble\Support\Generator\Response as ScrambleResponse;
use Dedoc\Scramble\Support\Generator\Tag;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

#[Tag('User')]
class UserController extends Controller
{
    #[Operation(
        summary: 'Update user profile',
        description: 'Update the current user\'s profile information including avatar path'
    )]
    #[ScrambleResponse(
        status: 200,
        description: 'User profile updated successfully',
        type: UserResource::class
    )]
    #[ScrambleResponse(
        status: 422,
        description: 'Validation failed'
    )]
    #[ScrambleResponse(
        status: 401,
        description: 'Unauthenticated'
    )]
    public function update(UpdateUserRequest $request)
    {
        $user = $request->user();
        
        // Only update fields that are provided in the request
        $updateData = $request->only(['name', 'avatar_path']);
        
        $user->update($updateData);
        
        return new UserResource($user);
    }

    #[Operation(
        summary: 'Get current user profile',
        description: 'Returns the current user\'s profile information'
    )]
    #[ScrambleResponse(
        status: 200,
        description: 'Current user profile',
        type: UserResource::class
    )]
    #[ScrambleResponse(
        status: 401,
        description: 'Unauthenticated'
    )]
    public function show(Request $request)
    {
        return new UserResource($request->user());
    }
}
