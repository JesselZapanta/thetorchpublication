<?php

namespace App\Http\Requests\Designer;

use Illuminate\Foundation\Http\FormRequest;

class DesignerStoreNewsletterRequest extends FormRequest
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
            // 'academic_year_id' => ['required','exists:academic_years,id'],
            'layout_by' => ['nullable','exists:users,id'],
            'description' => ['required', 'string', 'max:255'],
            'newsletter_thumbnail_image_path' => ['required','image','mimes:jpg,png,jpeg'],//todo
            'newsletter_file_path' => ['required','file','mimes:pdf'], //todo
            // 'status' => ['required',
            //     Rule::in(['pending','revision', 'approved'])
            // ],
        ];
    }
}
