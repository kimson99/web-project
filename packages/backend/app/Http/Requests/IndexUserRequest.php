<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class IndexUserRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'skip' => ['sometimes', 'integer', 'min:0'],
            'take' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'search' => ['sometimes', 'string', 'max:255'],
            'role' => ['sometimes', 'string', 'in:member,admin'],
            'sort_by' => ['sometimes', 'string', 'in:name,email,created_at,role'],
            'sort_order' => ['sometimes', 'string', 'in:asc,desc'],
        ];
    }

    /**
     * Get default values for the request.
     */
    public function validated($key = null, $default = null)
    {
        $validated = parent::validated();

        // Set defaults
        $validated['skip'] = $validated['skip'] ?? 0;
        $validated['take'] = $validated['take'] ?? 10;
        $validated['sort_by'] = $validated['sort_by'] ?? 'created_at';
        $validated['sort_order'] = $validated['sort_order'] ?? 'desc';

        return $key ? ($validated[$key] ?? $default) : $validated;
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'skip.integer' => 'Skip must be an integer.',
            'skip.min' => 'Skip must be at least 0.',
            'take.integer' => 'Take must be an integer.',
            'take.min' => 'Take must be at least 1.',
            'take.max' => 'Take may not be greater than 100.',
            'search.string' => 'Search must be a string.',
            'search.max' => 'Search may not be greater than 255 characters.',
            'role.in' => 'Role must be either member or admin.',
            'sort_by.in' => 'Sort by must be one of: name, email, created_at, role.',
            'sort_order.in' => 'Sort order must be either asc or desc.',
        ];
    }
}