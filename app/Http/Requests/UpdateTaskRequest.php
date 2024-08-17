<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskRequest extends FormRequest
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
            'layout_by' => ['required','exists:users,id'],
            'assigned_by' => ['required','exists:users,id'],
            'description' => ['required' , 'string'],
            'body' => ['nullable'],
            'message' => ['nullable'],
            'priority' => ['required',
                Rule::in(['low', 'medium', 'high'])
            ],
            'status' => ['required',
                Rule::in(['pending', 'revision', 'approved', 'published'])
            ],
            'due_date' => ['required', 'date', 'after:today'], 
            'task_image_path' => ['nullable'],
        ];
    }
}
