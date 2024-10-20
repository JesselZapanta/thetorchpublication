<?php

namespace App\Http\Requests\Editor;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EditorUpdateTaskRequest extends FormRequest
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
        $isRequired = $this->input('draft') === 'no' ? 'required' : 'nullable';

        return [
            // 'title'   => [$isRequired, 'string'],
            'title' => [$isRequired, 'string', 'max:255', 'unique:articles,title'],
            'excerpt' => [$isRequired, 'string', 'max:500'],
            'body'    => [$isRequired, 'string'],
            'caption' => [$isRequired, 'string', 'max:255'],
            'draft'  => ['required', Rule::in(['no', 'yes'])],
        ];

        //  'title' => ['required', 'string', 'max:255', Rule::unique('articles')->ignore($this->route('student_article'))],
        // 'title' => ['required', 'string', 'max:255', 'unique:articles,title'],
    }
}
