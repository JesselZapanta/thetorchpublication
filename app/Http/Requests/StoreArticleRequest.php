<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreArticleRequest extends FormRequest
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
            'created_by' => ['nullable','exists:users,id'],
            'edited_by' => ['nullable','exists:users,id'],
            'layout_by' => ['nullable','exists:users,id'],
            'title' => ['required', 'string'],
            'body' => ['required', 'string' ],
            'caption' => ['required', 'string' ],
            'status' => ['required',
                Rule::in(['pending','reject','edited', 'revision', 'publish'])
            ],
            'article_image_path' => ['required','image','mimes:jpg,png,jpeg'],
        ];
    }
}
