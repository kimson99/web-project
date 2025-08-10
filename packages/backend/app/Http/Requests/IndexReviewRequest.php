<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class IndexReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'book_id' => ['nullable', 'integer', 'exists:books,id'],
            'skip' => ['nullable', 'integer', 'min:0'],
            'take' => ['nullable', 'integer', 'min:1', 'max:100'],
            'sort_by' => ['nullable', 'string', 'in:created_at,updated_at'],
            'sort_order' => ['nullable', 'string', 'in:asc,desc'],
        ];
    }

    /**
     * Get the default values for the request.
     */
    public function defaults(): array
    {
        return [
            'sort_by' => 'created_at',
            'sort_order' => 'desc',
            'take' => 15,
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
            'book_id.integer' => 'Book ID must be a number.',
            'book_id.exists' => 'The selected book does not exist.',
            'skip.integer' => 'Skip must be a number.',
            'skip.min' => 'Skip cannot be negative.',
            'take.integer' => 'Take must be a number.',
            'take.min' => 'Take must be at least 1.',
            'take.max' => 'Take cannot exceed 100.',
            'sort_by.string' => 'Sort by must be a string.',
            'sort_by.in' => 'Sort by must be one of: created_at, updated_at.',
            'sort_order.string' => 'Sort order must be a string.',
            'sort_order.in' => 'Sort order must be one of: asc, desc.',
        ];
    }
} 