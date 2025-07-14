<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookRequest extends FormRequest
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
            'isbn'=> ['string'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255'],
            'cover_image_path' => ['required', 'string', 'max:255'],
            'author' => ['required', 'string', 'max:255'],
            'num_pages' => ['required', 'integer', 'min:1'],
            'edition' => ['required', 'string', 'max:255'],
            'published_year' => ['required', 'string', 'max:4'],
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
            'name.required' => 'Book name is required.',
            'name.max' => 'Book name cannot exceed 255 characters.',
            'description.required' => 'Book description is required.',
            'description.max' => 'Book description cannot exceed 255 characters.',
            'cover_image_path.required' => 'Cover image path is required.',
            'cover_image_path.max' => 'Cover image path cannot exceed 255 characters.',
            'author.required' => 'Book author is required.',
            'author.max' => 'Author name cannot exceed 255 characters.',
            'num_pages.required' => 'Number of pages is required.',
            'num_pages.integer' => 'Number of pages must be a whole number.',
            'num_pages.min' => 'Number of pages must be at least 1.',
            'edition.required' => 'Book edition is required.',
            'edition.max' => 'Edition cannot exceed 255 characters.',
            'published_year.required' => 'Published year is required.',
            'published_year.max' => 'Published year cannot exceed 4 characters.',
        ];
    }
}
