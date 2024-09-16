<?php

namespace App\Http\Controllers\Writer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Writer\WriterUpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use App\Models\Category;
use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\User;
use Auth;
use Illuminate\Support\Facades\Storage;

class WriterTaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $tasks = Task::all();
        $query = Task::query();
        $id = Auth::user()->id;

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

        $tasks = $query->where('assigned_by', $id)
                        ->orderBy($sortField, $sortDirection) 
                        ->paginate(10)
                        ->onEachSide(1);

        $users = User::whereIn('role', ['editor', 'writer', 'designer'])->get();
        $categories = Category::all();
        $designers = User::where('role', 'designer')->get();
    
        return inertia('Writer/Task/Index', [
            'queryParams' => request()->query() ? : null,
            'tasks' => TaskResource::collection($tasks),
            'users' => UserResource::collection($users),
            'designers' => UserResource::collection($designers),
            'categories' => UserResource::collection($categories),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
        $users = User::whereIn('role', ['editor', 'writer', 'designer'])->get();
        $categories = Category::all();
        $designers = User::where('role', 'designer')->get();

        return inertia('Writer/Task/Create', [
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

        Task::create($data);

        return to_route('writer-task.index')->with(['success' => 'Task Assigned Successfully']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $writer_task)
    {
        return inertia('Writer/Task/Edit', [
            'task' => new TaskResource($writer_task),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(WriterUpdateTaskRequest $request, Task $writer_task)
    {

        $data = $request->validated();
        if($data['draft'] === 'no'){
            $data['status'] = 'approval';
        }

        $writer_task->update($data);

        if($data['draft'] === 'yes'){
            return to_route('writer-task.index')->with(['success' => 'Task Save as Draft']);
        }

        return to_route('writer-task.index')->with(['success' => 'Task Submitted Successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $writer_task)
    {
        $writer_task->delete();
        if($writer_task->task_image_path){
            Storage::disk('public')->deleteDirectory(dirname($writer_task->task_image_path));
        }
        return to_route('writer-task.index')->with(['success' => 'Deleted Successfully']);
    }
}
