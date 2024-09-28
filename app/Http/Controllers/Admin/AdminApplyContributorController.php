<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\ContributorApplicationResource;
use App\Models\ContributorApplication;
use Illuminate\Http\Request;

class AdminApplyContributorController extends Controller
{
    public function index()
    {
        // $contributorApplications = ContributorApplication::all();

        $query = ContributorApplication::query();

        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');

        if (request('name')) {
            // Filter based on related user's name
            $query->whereHas('user', function ($q) {
                $q->where('name', 'like', '%' . request('name') . '%');
            });
        }

        
        // if (request('email')) {
        //     // Filter based on related user email
        //     $query->whereHas('user', function ($q) {
        //         $q->where('email', 'like', '%' . request('email') . '%');
        //     });
        // }


        $contributorApplications = $query->orderBy($sortField, $sortDirection)
                                    ->where('status', 'pending')
                                    ->paginate(10)
                                    ->onEachSide(1);


        return inertia('Admin/User/Contributor',[
            'contributorApplications' => ContributorApplicationResource::collection($contributorApplications),
            'queryParams' => request()->query() ? : null,
        ]);
    }

    // public function inddsadex()
    // {   
    //     // $users = User::all();
    //     $query = User::query();

    //     $sortField = request('sort_field', 'created_at');
    //     $sortDirection = request('sort_direction', 'desc');
        
        
    //     if(request('student_id')){
    //         $query->where('student_id', 'like', '%'. request('student_id') . '%');
    //     }
        
    //     if(request('name')){
    //         $query->where('name', 'like', '%'. request('name') . '%');
    //     }
    //     if(request('email')){
    //         $query->where('email', 'like', '%'. request('email') . '%');
    //     }

    //     if(request('role')){
    //         $query->where('role', request('role'));
    //     }

    //     $users = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

    //     return inertia('Admin/User/Index',[
    //         'users' => UserResource::collection($users),
    //         'queryParams' => request()->query() ? : null,
    //     ]);
    // }

    public function reject($id)
    {
        $application = ContributorApplication::find($id);

        if(!$application){
            return back()->with('error', 'Application not found.');
        }

        // dd($application);

        $application->update(['status' => 'rejected']);


        return to_route('admin-review-report-freedom-wall.index')->with(['success' => 'Application rejected successfully']);
    }

}
