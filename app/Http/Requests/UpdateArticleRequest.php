<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateArticleRequest extends FormRequest
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
            'category_id' => ['required','exists:categories,id'],
            'academic_year_id' => ['required','exists:academic_years,id'],//added
            'created_by' => ['nullable','exists:users,id'],
            'author' => ['nullable','string', 'max:255'],//added
            'edited_by' => ['nullable','exists:users,id'],
            'layout_by' => ['nullable','exists:users,id'],
            'title' => ['required', 'string'],
            'excerpt' => ['required', 'string'],//added
            'body' => ['required', 'string' ],
            'caption' => ['required', 'string' ],
            'status' => ['required',
                Rule::in(['pending','reject','edited', 'revision', 'published'])
            ],
            'article_image_path' => ['nullable','image','mimes:jpg,png,jpeg'],
            'is_featured' => ['nullable', Rule::in(['no','yes',])],
            'is_anonymous' => ['nullable', Rule::in(['no','yes',])],
            'published_date' => ['required', 'date'],
        ];
    }
}
