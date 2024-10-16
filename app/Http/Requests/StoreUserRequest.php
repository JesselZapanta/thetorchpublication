<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
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
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required',
                Rule::in(['student', 'admin', 'student_contributor', 'editor', 'writer', 'designer'])
            ],
            'position' => ['nullable', 'string', 'max:255'],
            'status' => ['required',
                Rule::in(['active', 'inactive'])
            ],
            'profile_image_path' => ['required','image','mimes:jpg,png,jpeg'],
            'password' => ['required', 'confirmed',Password::min(8)->letters()]
        ];
    }
}

