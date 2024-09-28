<?php

namespace App\Http\Requests\Student;

use App\Models\ContributorApplication;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StudentStoreContributorRequest extends FormRequest
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
        // Get the current contributor application for the user
        $contributorApplication = ContributorApplication::where('user_id', Auth::id())->first();

        return [
            'applied_for' => ['required', 'string'],
            'institute' => ['required', 'string'],
            'program' => ['required', 'string'],
            // Only require the file if it's not already uploaded
            'sample_work_file_path' => [$contributorApplication ? 'nullable' : 'required', 'file', 'mimes:pdf'],
        ];
    }

}
