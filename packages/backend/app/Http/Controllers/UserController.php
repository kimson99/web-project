<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\IndexUserRequest;
use App\Http\Requests\AdminUpdateUserRequest;
use App\Http\Resources\ApiResponse;
use App\Http\Resources\UserResource;
use App\Http\Resources\UserProfileResource;
use App\Models\User;
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

    #[Operation(
        summary: 'Get user profile by ID',
        description: 'Returns a user\'s public profile information including reviews and library stats'
    )]
    #[ScrambleResponse(
        status: 200,
        description: 'User profile',
        type: UserProfileResource::class
    )]
    #[ScrambleResponse(
        status: 404,
        description: 'User not found'
    )]
    public function profile(string $userId)
    {
        $user = User::with(['reviews.book', 'userBooks.book'])
            ->findOrFail($userId);
            
        return new UserProfileResource($user);
    }

    #[Operation(
        summary: 'Get all users (Admin only)',
        description: 'Returns a paginated list of all users with search and filtering options'
    )]
    #[ScrambleResponse(
        status: 200,
        description: 'Users retrieved successfully'
    )]
    #[ScrambleResponse(
        status: 403,
        description: 'Admin access required'
    )]
    public function index(IndexUserRequest $request)
    {
        $query = User::query();

        // Apply search
        if ($request->filled('search')) {
            $searchTerm = $request->validated('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('email', 'like', "%{$searchTerm}%");
            });
        }

        // Apply role filtering
        if ($request->filled('role')) {
            $query->where('role', $request->validated('role'));
        }

        // Apply sorting
        $sortBy = $request->validated('sort_by', 'created_at');
        $sortOrder = $request->validated('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Add statistics
        $query->withCount(['reviews', 'userBooks']);

        // Apply pagination
        $skip = $request->validated('skip', 0);
        $take = $request->validated('take', 10);
        
        $total = $query->count();
        $users = $query->skip($skip)->take($take)->get();

        return response()->json([
            'data' => UserResource::collection($users),
            'meta' => [
                'total' => $total,
                'skip' => $skip,
                'take' => $take,
            ]
        ]);
    }

    #[Operation(
        summary: 'Update user (Admin only)',
        description: 'Update user role, active status, or name. Admin access required.'
    )]
    #[ScrambleResponse(
        status: 200,
        description: 'User updated successfully',
        type: UserResource::class
    )]
    #[ScrambleResponse(
        status: 404,
        description: 'User not found'
    )]
    #[ScrambleResponse(
        status: 403,
        description: 'Admin access required'
    )]
    public function adminUpdate(AdminUpdateUserRequest $request, $user)
    {
        $foundUser = User::find($user);
        
        if (!$foundUser) {
            return response()->json(['message' => 'User not found'], 404);
        }
        
        $foundUser->update($request->validated());
        
        return new UserResource($foundUser);
    }

    #[Operation(
        summary: 'Delete user (Admin only)',
        description: 'Delete a user account. This will also remove associated reviews and library entries.'
    )]
    #[ScrambleResponse(
        status: 200,
        description: 'User deleted successfully'
    )]
    #[ScrambleResponse(
        status: 404,
        description: 'User not found'
    )]
    #[ScrambleResponse(
        status: 403,
        description: 'Admin access required'
    )]
    public function destroy(User $user)
    {
        if (!auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Admin access required'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
