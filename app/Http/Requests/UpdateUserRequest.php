<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
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
            'student_id' => ['required', 'integer'],
            'username' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($this->route('user'))],
            'role' => ['required',
                Rule::in(['admin', 'student', 'student_contributor' , 'editor', 'writer', 'designer'])
            ],
            'position' => ['nullable', 'string', 'max:255'],
            'status' => ['required',
                Rule::in(['active', 'inactive'])
            ],
            'profile_image_path' => ['nullable','image','mimes:jpg,png,jpeg'],
            'password' => ['nullable', 'confirmed', Password::min(8)->letters()],
        ];
    }
}
