<?php

namespace App\Http\Requests\Designer;

use Illuminate\Foundation\Http\FormRequest;

class DesignerUpdateNewsletterRequest extends FormRequest
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
            'description' => ['required', 'string'],
            'newsletter_thumbnail_image_path' => ['nullable','image','mimes:jpg,png,jpeg'],
            'newsletter_file_path' => ['nullable','file','mimes:pdf'], 
        ];
    }
}
