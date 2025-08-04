<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserBookRequest extends FormRequest
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
            'notes' => ['nullable', 'string', 'max:1000'],
            'current_page' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', 'string', 'in:want-to-read,reading,finished'],
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
            'book_id.exists' => 'The selected book does not exist.',
            'notes.string' => 'Notes must be a string.',
            'notes.max' => 'Notes cannot exceed 1000 characters.',
            'current_page.integer' => 'Current page must be a whole number.',
            'current_page.min' => 'Current page cannot be negative.',
            'status.string' => 'Status must be a string.',
            'status.in' => 'Status must be one of: want-to-read, reading, finished.',
        ];
    }
} 