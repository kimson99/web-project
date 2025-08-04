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
        return auth()->check() && auth()->user()->isAdmin();
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
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255'],
            'cover_image_path' => ['required', 'string', 'max:255'],
            'authors' => ['required', 'array', 'min:1'],
            'authors.*' => ['required', 'string', 'max:255'],
            'num_pages' => ['required', 'integer', 'min:1'],
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
            'title.required' => 'Book title is required.',
            'title.max' => 'Book title cannot exceed 255 characters.',
            'description.required' => 'Book description is required.',
            'description.max' => 'Book description cannot exceed 255 characters.',
            'cover_image_path.required' => 'Cover image path is required.',
            'cover_image_path.max' => 'Cover image path cannot exceed 255 characters.',
            'authors.required' => 'Book authors are required.',
            'authors.array' => 'Authors must be provided as a list.',
            'authors.min' => 'At least one author is required.',
            'authors.*.required' => 'Author name is required.',
            'authors.*.max' => 'Author name cannot exceed 255 characters.',
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
