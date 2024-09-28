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
        

        $existingApplication = ContributorApplication::where('user_id', $user_id)->first();

        // dd($existingApplication);
        

        return inertia('Student/Contributor', [
            'existingApplication' => $existingApplication ? new ContributorApplicationResource($existingApplication) : null,
        ]);
    }

    public function store(StudentStoreContributorRequest $request)
    {
        $user_id = Auth::user()->id;

        $data = $request->validated();

        $data['user_id'] = $user_id;

        $contributorApplication = ContributorApplication::where('user_id', $user_id)->first();

        $current_status = null;

        // Check if the contributor application exists
        if ($contributorApplication) {
            $current_status = $contributorApplication->status;

            // If the status is 'rejected', set it to 'pending'
            if ($current_status === 'rejected') {
                $data['status'] = 'pending';
            }
        } else {
            // If there's no application, you may want to set the initial status
            $data['status'] = 'pending'; // or another default value
        }

        $sample_file = $data['sample_work_file_path'];

        if ($sample_file) {
            if ($contributorApplication && $contributorApplication->sample_work_file_path) {
                Storage::disk('public')->delete($contributorApplication->sample_work_file_path);
            }
            $data['sample_work_file_path'] = $sample_file->store('sample_file', 'public');
        } elseif ($contributorApplication) {
            $data['sample_work_file_path'] = $contributorApplication->sample_work_file_path;
        }

        // dd($data);


        // Update or create the contributor application
        ContributorApplication::updateOrCreate(
            $data,
            ['user_id' => $user_id]
                                
        );

        return to_route('student-contributor.create')->with(['success' => 'Application submitted successfully']);
    }

    public function destroy($id){

        $application = ContributorApplication::find($id);

        if(!$application){
            return to_route('student-contributor.create')->with(key: ['error' => 'Application not found.']);
        }

        $application->delete();

        // dd($application);

        if($application->sample_work_file_path){
            Storage::disk('public')->delete($application->sample_work_file_path);
        }

        return to_route('student-contributor.create')->with(['success' => 'Application deleted successfully']);
    }
    
}
