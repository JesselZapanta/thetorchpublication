<?php

namespace App\Http\Requests\Writer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class WriterUpdateTaskRequest extends FormRequest
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
            'title'   => [$isRequired, 'string'],
            'excerpt' => [$isRequired, 'string'],
            'body'    => [$isRequired, 'string'],
            'caption' => [$isRequired, 'string'],
            'draft'  => ['required', Rule::in(['no', 'yes'])],
        ];
    }
}
