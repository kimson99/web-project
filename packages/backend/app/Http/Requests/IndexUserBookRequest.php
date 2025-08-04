<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class IndexUserBookRequest extends FormRequest
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
            'skip' => ['sometimes', 'integer', 'min:0'],
            'take' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'status' => ['sometimes', 'string', 'in:want-to-read,reading,finished'],
            'search' => ['sometimes', 'string', 'max:255'],
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
            'skip.integer' => 'Skip must be a whole number.',
            'skip.min' => 'Skip cannot be negative.',
            'take.integer' => 'Take must be a whole number.',
            'take.min' => 'Take must be at least 1.',
            'take.max' => 'Take cannot exceed 100.',
            'status.string' => 'Status must be a string.',
            'status.in' => 'Status must be one of: want-to-read, reading, finished.',
            'search.string' => 'Search must be a string.',
            'search.max' => 'Search cannot exceed 255 characters.',
        ];
    }
} 