<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\StudentStoreContributorRequest;
use App\Http\Resources\Student\ContributorApplicationResource;
use App\Models\ContributorApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class StudentApplyContributorController extends Controller
{
    public function create()
    {
        $user_id = Auth::user()->id;
        

        $existingEntry = ContributorApplication::where('user_id', $user_id)->first();

        // dd($existingEntry);
        

        return inertia('Student/Contributor', [
            'existingEntry' => new ContributorApplicationResource($existingEntry),
        ]);
    }

    public function store(StudentStoreContributorRequest $request)
{
    $user_id = Auth::user()->id;

    $data = $request->validated();

    $data['user_id'] = $user_id;

    $contributorApplication = ContributorApplication::where('user_id', $user_id)->first();

    // Handle the file upload for the sample work file
    $sample_file = $data['sample_work_file_path'];

    if ($sample_file) {
        if ($contributorApplication && $contributorApplication->sample_work_file_path) {
            Storage::disk('public')->delete($contributorApplication->sample_work_file_path);
        }

        $data['sample_work_file_path'] = $sample_file->store('sample_file', 'public');
    }

    // Update or create the contributor application
    ContributorApplication::updateOrCreate(
        ['user_id' => $user_id],  
        $data                      
    );
    return to_route('student.dashboard')->with(['success' => 'Application submitted successfully']);
}
}
