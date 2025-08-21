<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookRequest extends FormRequest
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
            'isbn'=> ['sometimes', 'string'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'cover_image_path' => ['sometimes', 'string', 'max:255'],
            'authors' => ['sometimes', 'array', 'min:1'],
            'authors.*' => ['string', 'max:255'],
            'num_pages' => ['sometimes', 'integer', 'min:1'],
            'published_year' => ['sometimes', 'string', 'max:4'],
        ];
    }
}
