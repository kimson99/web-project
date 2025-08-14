<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class IndexAuthorRequest extends FormRequest
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
            'skip' => ['nullable', 'integer', 'min:0'],
            'take' => ['nullable', 'integer', 'min:1', 'max:100'],
            'search' => ['nullable', 'string', 'max:255'],
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
            'skip.integer' => 'Skip must be a number.',
            'skip.min' => 'Skip cannot be negative.',
            'take.integer' => 'Take must be a number.',
            'take.min' => 'Take must be at least 1.',
            'take.max' => 'Take cannot exceed 100.',
            'search.string' => 'Search term must be a string.',
            'search.max' => 'Search term cannot exceed 255 characters.',
        ];
    }
}