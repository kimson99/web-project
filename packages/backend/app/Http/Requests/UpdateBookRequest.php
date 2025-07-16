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
            'isbn'=> ['sometimes', 'string'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string', 'max:255'],
            'cover_image_path' => ['sometimes', 'required', 'string', 'max:255'],
            'authors' => ['sometimes', 'required', 'array', 'min:1'],
            'authors.*' => ['required', 'string', 'max:255'],
            'num_pages' => ['sometimes', 'required', 'integer', 'min:1'],
            'published_year' => ['sometimes', 'required', 'string', 'max:4'],
        ];
    }
}
