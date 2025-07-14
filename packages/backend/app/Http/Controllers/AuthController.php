<?php

namespace App\Http\Controllers;

use App\Http\Resources\ApiResponse;
use App\Models\User;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Http\Resources\UserResource;
use Dedoc\Scramble\Support\Generator\Operation;
use Dedoc\Scramble\Support\Generator\Response as ScrambleResponse;
use Dedoc\Scramble\Support\Generator\Tag;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Str;


#[Tag('Authentication')]
class AuthController extends Controller {

  #[Operation(
    summary: 'Register a new user',
    description: 'Creates a new user account with the provided information'
  )]
  #[ScrambleResponse(
    status: 201,
    description: 'User created successfully',
    type: UserResource::class
  )]
  #[ScrambleResponse(
    status: 422,
    description: 'Validation failed'
  )]
  public function create(RegisterRequest $request) {
    $user = User::create([
      'name' => $request->validated('name'),
      'email' => $request->validated('email'),
      'password' => Hash::make($request->validated('password'))
    ]);

    event(new Registered($user));

    return new UserResource($user);
  }

  #[Operation(
    summary: 'Authenticate user',
    description: 'Logs in a user with email and password'
  )]
  #[ScrambleResponse(
    status: 200,
    description: 'User authenticated successfully',
    type: UserResource::class
  )]
  #[ScrambleResponse(
    status: 422,
    description: 'Validation failed'
  )]
  #[ScrambleResponse(
    status: 401,
    description: 'Invalid credentials'
  )]
  public function authenticate(LoginRequest $request) {
    $credentials = $request->validated();

    if (Auth::attempt($credentials)) {
      $user = Auth::user();
      return new UserResource($user);
    }

    return ApiResponse::error('Invalid credentials', 401);
  }

  #[Operation(
    summary: 'Get current user',
    description: 'Returns the currently authenticated user'
  )]
  #[ScrambleResponse(
    status: 200,
    description: 'Current user information',
    type: UserResource::class
  )]
  #[ScrambleResponse(
    status: 401,
    description: 'Unauthenticated'
  )]
  public function getMe(Request $request) {
    return new UserResource($request->user());
  }

  #[Operation(
    summary: 'Logout user',
    description: 'Logs out the currently authenticated user'
  )]
  #[ScrambleResponse(
    status: 200,
    description: 'User logged out successfully'
  )]
  public function logout(Request $request) {
    $request->session()->invalidate();
 
    $request->session()->regenerateToken();
    
    return ApiResponse::success(null, 'Logged out successfully');
  }

  #[Operation(
    summary: 'Send password reset link',
    description: 'Sends a password reset link to the user\'s email address'
  )]
  #[ScrambleResponse(
    status: 200,
    description: 'Password reset link sent successfully'
  )]
  #[ScrambleResponse(
    status: 422,
    description: 'Validation failed'
  )]
  public function forgotPassword(ForgotPasswordRequest $request) {
    $status = Password::sendResetLink(
      $request->only('email')
    );

    if ($status === Password::RESET_LINK_SENT) {
      return ApiResponse::success(null, 'Password reset link sent to your email');
    }

    return ApiResponse::error('Unable to send password reset link', 400);
  }

  #[Operation(
    summary: 'Reset password',
    description: 'Resets the user\'s password using the provided token'
  )]
  #[ScrambleResponse(
    status: 200,
    description: 'Password reset successfully'
  )]
  #[ScrambleResponse(
    status: 422,
    description: 'Validation failed'
  )]
  #[ScrambleResponse(
    status: 400,
    description: 'Invalid or expired token'
  )]
  public function resetPassword(ResetPasswordRequest $request) {
    $status = Password::reset(
      $request->only('email', 'password', 'password_confirmation', 'token'),
      function (User $user, string $password) {
        $user->forceFill([
          'password' => Hash::make($password)
        ])->setRememberToken(Str::random(60));

        $user->save();
      }
    );

    if ($status === Password::PASSWORD_RESET) {
      return ApiResponse::success(null, 'Password reset successfully');
    }

    return ApiResponse::error('Invalid or expired reset token', 400);
  }
}