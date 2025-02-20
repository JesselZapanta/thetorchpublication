<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StudentStoreArticleRequest extends FormRequest
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
            // 'academic_year_id' => ['required','exists:academic_years,id'],//added
            'created_by' => ['nullable','exists:users,id'],
            // 'author' => ['nullable','string', 'max:255'],//added
            // 'edited_by' => ['nullable','exists:users,id'],
            // 'layout_by' => ['nullable','exists:users,id'],
            'title' => ['required', 'string', 'max:255', 'unique:articles,title'],
            'excerpt' => ['required', 'string', 'max:500'],//added
            'body' => ['required', 'string' ],
            'caption' => ['required', 'string', 'max:255'],
            'status' => ['required',
                Rule::in(['draft','pending'])
            ],
            'article_image_path' => ['required','image','mimes:jpg,png,jpeg'],
            // 'is_featured' => ['required', Rule::in(['no','yes',])],
            'is_anonymous' => ['required', Rule::in(['no','yes',])],
            // 'published_date' => ['required', 'date'],//added
        ];

      //  'title' => ['required', 'string', 'max:255', Rule::unique('articles')->ignore($this->route('student_article'))],
        // 'title' => ['required', 'string', 'max:255', 'unique:articles,title'],
    }
}
