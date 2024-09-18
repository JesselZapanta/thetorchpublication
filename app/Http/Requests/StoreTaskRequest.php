<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
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
            'name' => ['required', 'string'],
            'category_id' => ['required','exists:categories,id'],
            'academic_year_id' => ['required','exists:academic_years,id'],
            'layout_by' => ['required','exists:users,id'],
            'assigned_by' => ['required','exists:users,id'],
            'description' => ['required' , 'string'],
            'body' => ['nullable'],
            'message' => ['nullable'],
            'priority' => ['required',
                Rule::in(['low', 'medium', 'high'])
            ],
            'due_date' => ['required', 'date', 'after:today'], 
            'task_image_path' => ['nullable'],
        ];
    }
}
