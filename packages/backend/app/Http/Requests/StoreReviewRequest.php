<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'book_id' => ['required', 'string', 'exists:books,id'],
            'content' => ['nullable', 'string', 'max:1000'],
            'rating' => ['required', 'integer', 'between:1,5'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'book_id.required' => 'Book ID is required.',
            'book_id.string' => 'Book ID must be a string.',
            'book_id.exists' => 'The specified book does not exist.',
            'content.string' => 'Review content must be a string.',
            'content.max' => 'Review content cannot exceed 1000 characters.',
            'rating.required' => 'Rating is required.',
            'rating.integer' => 'Rating must be a number.',
            'rating.between' => 'Rating must be between 1 and 5.',
        ];
    }
} 