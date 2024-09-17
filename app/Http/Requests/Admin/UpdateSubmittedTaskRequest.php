<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSubmittedTaskRequest extends FormRequest
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
            'title'   => ['required', 'string'],
            'excerpt' => ['required', 'string'],
            'body'    => ['required', 'string'],
            'caption' => ['required', 'string'],
            'status'  => ['required', Rule::in(['approved','content_revision', 'image_revision', 'completed'])],
            'content_revision_message' => ['nullable', 'string', 'required_if:status,content_revision'],
            'image_revision_message' => ['nullable', 'string', 'required_if:status,image_revision'],
        ];
    }
}
