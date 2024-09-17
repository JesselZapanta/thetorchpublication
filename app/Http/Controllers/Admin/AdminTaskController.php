<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSubmittedTaskRequest;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use App\Models\Category;
use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class AdminTaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $tasks = Task::all();
        $query = Task::query();

        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');
        

        if(request('name')){
            $query->where('name', 'like', '%'. request('name') . '%');
        }

        if(request('status')){
            $query->where('status', request('status'));
        }

        if(request('priority')){
            $query->where('priority', request('priority'));
        }

        //assignedBy
        if (request('assigned_by')) {
            // Join with the users table to search by name
            $query->whereHas('assignedBy', function ($q) {
                $q->where('name', 'like', '%' . request('assigned_by') . '%');
            });
        }

        //layoutBy
        if (request('layout_by')) {
            // Join with the users table to search by name
            $query->whereHas('layoutBy', function ($q) {
                $q->where('name', 'like', '%' . request('layout_by') . '%');
            });
        }

        $tasks = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
    
        return inertia('Admin/Task/Index', [
            'queryParams' => request()->query() ? : null,
            'tasks' => TaskResource::collection($tasks),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
        $users = User::whereIn('role', ['editor', 'writer'])->get();
        $categories = Category::all();
        $designers = User::where('role', 'designer')->get();

        return inertia('Admin/Task/Create', [
            'users' => UserResource::collection($users),
            'designers' => UserResource::collection($designers),
            'categories' => UserResource::collection($categories),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();

        $data['assigned_date'] = now();

        Task::create($data);

        return to_route('admin-task.index')->with(['success' => 'Task Assigned Successfully']);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $task = Task::find($id);

        if(!$task){
            return to_route('admin-task.index')->with(['error' => 'Task not found']);
        }

        if($task->status === 'pending'){
            return to_route('admin-task.index')->with(['error' => 'Task is still pending']);
        }

        if($task->status === 'progress'){
            return to_route('admin-task.index')->with(['error' => 'Task is still in Progress']);
        }


        return inertia('Admin/Task/Show', [
            'task' => new TaskResource($task),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $task = Task::find($id);

        if(!$task){
            return to_route('admin-task.index')->with(['error' => 'Task not found']);
        }

        if($task->status !== 'pending'){
            return to_route('admin-task.index')->with(['error' => 'The task can no longer be modified.']);
        }

        $users = User::whereIn('role', ['editor', 'writer', 'designer'])->get();
        $categories = Category::all();
        $designers = User::where('role', 'designer')->get();

        return inertia('Admin/Task/Edit', [
            'task' => new TaskResource($task),
            'users' => UserResource::collection($users),
            'designers' => UserResource::collection($designers),
            'categories' => UserResource::collection($categories),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request,$id)
    {
        $task = Task::find($id);
        
        $data = $request->validated();

        if($task->status !== 'pending'){
            return to_route('admin-task.index')->with(['error' => 'The task can no longer be modified.']);
        }
        
        $task->update($data);

        return to_route('admin-task.index')->with(['success' => 'Task Updated Successfully']);
    }

    /**
     * Approved the task
     */
    public function updateSubmittedTask(UpdateSubmittedTaskRequest $request, $id)
    {
        // Find the task
        $task = Task::find($id);

        // Check if task exists
        if(!$task){
            return to_route('admin-task.index')->with(['error' => 'Task Not Found.']);
        }

        // Get the validated data
        $data = $request->validated();

        // Set content_revision_date or content_approved_date based on the new status
        if($data['status'] === 'content_revision'){
            $data['content_revision_date'] = now();
            $data['content_approved_date'] = null;
        }

        if($data['status'] === 'approved'){
            $data['content_approved_date'] = now();
        }

        // Update the task
        $task->update($data);

        // Check the status after update and redirect with appropriate message
        if($data['status'] === 'content_revision'){
            return to_route('admin-task.index')->with(['success' => 'The task Needed Revision.']);
        }

        return to_route('admin-task.index')->with(['success' => 'Task Updated Successfully']);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $admin_task)
    {
        $admin_task->delete();
        if($admin_task->task_image_path){
            Storage::disk('public')->deleteDirectory(dirname($admin_task->task_image_path));
        }
        return to_route('admin-task.index')->with(['success' => 'Deleted Successfully']);
    }
}
