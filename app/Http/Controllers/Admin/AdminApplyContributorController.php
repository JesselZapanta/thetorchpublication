<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ApplicationUpdateUserRequest;
use App\Http\Resources\Student\ContributorApplicationResource;
use App\Http\Resources\UserResource;
use App\Models\ContributorApplication;
use App\Models\User;
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

        if(request('applied_for')){
            $query->where('applied_for', request('applied_for'));
        }



        $contributorApplications = $query->orderBy($sortField, $sortDirection)
                                    ->where('status', 'pending')
                                    ->paginate(10)
                                    ->onEachSide(1);


        return inertia('Admin/User/Contributor',[
            'contributorApplications' => ContributorApplicationResource::collection($contributorApplications),
            'queryParams' => request()->query() ? : null,
        ]);
    }



    public function reject($id)
    {
        $application = ContributorApplication::find($id);

        if(!$application){
            return back()->with('error', 'Application not found.');
        }

        // dd($application);

        $application->update(['status' => 'rejected']);


        return to_route('admin-contributor.index')->with(['success' => 'Application rejected successfully']);
    }


    public function view($id)
    {
        $application = ContributorApplication::find($id);

        $userId = $application->user->id;

        $user = User::find($userId);

        if(!$user){
            return to_route('admin-contributor.index')->with(['error' => 'User not found.']);
        }

        return inertia('Admin/User/View',[
            'user' => new UserResource($user),
            'application' => new ContributorApplicationResource($application),
        ]);
    }

    public function update(ApplicationUpdateUserRequest $request, $id)
    {
        $data = $request->validated();

        $user = User::find($id);

        $user_id = $user->id;

        $application = ContributorApplication::where('user_id',$user_id)->first();

        // dd($application);
        $application->update(['status' => 'approved']);

        $user->update($data);

        return to_route('admin-contributor.index')->with(['success' => 'User was updated successfully.']);
    }
}
