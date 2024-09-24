<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAcademicYearRequest extends FormRequest
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
            'code' => ['required', 'string', 'max:255', 'unique:academic_years,code'],
            'description' => ['required', 'string', 'max:255', 'unique:academic_years,description'],
            'status' => ['required',
                Rule::in(['active','inactive'])
            ],

            'start_at' => ['required', 'date' ],
            'end_at' => ['required', 'date' ],
        ];
    }
}
