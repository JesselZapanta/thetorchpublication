<?php

namespace App\Http\Requests\Designer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DesignerUpdatePublicationRequest extends FormRequest
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
            'layout_by' => ['nullable','exists:users,id'],
            'description' => ['required', 'string', 'max:255'],
            'publication_thumbnail_image_path' => ['nullable','image','mimes:jpg,png,jpeg'],
            'publication_file_path' => ['nullable','file','mimes:pdf'], 
            'category' => ['required',
                Rule::in(['newsletter', 'folio', 'tabloid'])
            ],
        ];
    }
}
