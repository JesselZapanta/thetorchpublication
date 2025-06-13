<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Article;
use App\Models\Comment;
use App\Models\FreedomWall;
use App\Models\Task;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class AdminUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {   
        // $users = User::all();
        $admin_id = Auth::user()->id;
        $query = User::whereNot('id', $admin_id);

        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');
        
        
        if(request('student_id')){
            $query->where('student_id', 'like', '%'. request('student_id') . '%');
        }
        
        if(request('name')){
            $query->where('name', 'like', '%'. request('name') . '%');
        }
        if(request('email')){
            $query->where('email', 'like', '%'. request('email') . '%');
        }

        if(request('role')){
            $query->where('role', request('role'));
        }

        $users = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        return inertia('Admin/User/Index',[
            'users' => UserResource::collection($users),
            'queryParams' => request()->query() ? : null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Admin/User/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $image = $data['profile_image_path'];
        $data['password'] = bcrypt($data['password']);

        if($image){
            // Store the image directly under the 'profile/' directory and save its path
            $data['profile_image_path'] = $image->store('profile', 'public');
        }

        User::create($data);

        return to_route('user.index')->with(['success' => 'User was Created']);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = User::find($id);
        // dd($user);
        $userId = $user->id;

        if(!$user){
            return to_route('user.index')->with(['error' => 'User not found.']);
        }


        $articleCount = Article::where('created_by', $userId)
                                ->where('status', 'published')
                                ->where('visibility', 'visible')
                                ->count();

        $commentsCount = Comment::where('user_id', $userId)
                                ->where('visibility', 'visible')
                                ->count();

        $freedmWallEntriesCount = FreedomWall::where('user_id', $userId)
                                ->where('visibility', 'visible')
                                ->count();                      
        
        $taskCount = Task::where('assigned_to', $userId)
                                ->orWhere('layout_by', $userId)
                                ->count();      


        $contributions = [
            'articleCount' => $articleCount,
            'commentsCount' => $commentsCount,
            'freedmWallEntriesCount' => $freedmWallEntriesCount,
            'taskCount' => $taskCount,
        ];  

        return inertia('Admin/User/Show', [
            'user' => new UserResource($user),
            'contributions' => $contributions
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return inertia('Admin/User/Edit',[
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        // dd($request);
        $data = $request->validated();
        $password = $data['password'] ?? null;
        
        $image = $data['profile_image_path'];

        if($password){
            $data['password'] = bcrypt($data['password']);
        }else{
            unset($data['password']);
        }
    
        if ($image) {
            // Delete the old profile image file if a new one is uploaded
            if ($user->profile_image_path) {
                Storage::disk('public')->delete($user->profile_image_path);
            }
            // Store the new profile image directly under the 'profile/' directory
            $data['profile_image_path'] = $image->store('profile', 'public');
        } else {
            // If no new image is uploaded, keep the existing image
            $data['profile_image_path'] = $user->profile_image_path;
        }


        $user->update($data);

        // dd($data);

        return to_route('user.index')->with(['success' => 'User was Updated']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        if ($user->profile_image_path) {
            // Delete the specific old profile image file
            Storage::disk('public')->delete($user->profile_image_path);
        }

        return to_route('user.index')->with(['success' => 'Deleted Successfully']);
    }
}
