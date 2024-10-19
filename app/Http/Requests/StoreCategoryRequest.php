<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:30', 'unique:categories,name'],
            'description' => ['required', 'string', 'max:255' ],
            'status' => ['required',
                Rule::in(['active', 'inactive'])
            ],
            'category_image_path' => ['required','image','mimes:jpg,png,jpeg'],
        ];

         //   'name' => ['required', 'string', 'max:30',Rule::unique('categories')->ignore($this->route('category'))],
        //  'name' => ['required', 'string', 'max:30', 'unique:categories,name'],
    }
}
