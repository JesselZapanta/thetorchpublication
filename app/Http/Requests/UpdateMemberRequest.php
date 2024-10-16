<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMemberRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string' , 'max:255'],
            'role' => ['required',
                Rule::in(['student', 'admin', 'student_contributor', 'editor', 'writer', 'designer'])
            ],
            'status' => ['required',
                Rule::in(['active', 'inactive'])
            ],
            'member_image_path' => ['nullable','image','mimes:jpg,png,jpeg'],
        ];
    }
}
