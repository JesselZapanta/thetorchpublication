<?php

namespace App\Http\Controllers\Designer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Writer\WriterUpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Auth;
use Illuminate\Support\Facades\Storage;

class DesignerTaskController extends Controller
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

        $tasks = $query->where('assigned_by', $id)
                        ->orderBy($sortField, $sortDirection) 
                        ->paginate(10)
                        ->onEachSide(1);

        return inertia('Designer/Task/Index', [
            'queryParams' => request()->query() ? : null,
            'tasks' => TaskResource::collection($tasks),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $task = Task::find($id);

        if(!$task){
            return to_route('designer-task.index')->with(['error' => 'Task not found']);
        }

        return inertia('Designer/Task/Show', [
            'task' => new TaskResource($task),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(WriterUpdateTaskRequest $request, $id)
    {
        $task = Task::find($id);

        if(!$task){
            return to_route('designer-task.index')->with(['error' => 'Task not found']);
        }

        if($task->status !== 'pending' && $task->status !== 'content_revision' && $task->status !== 'progress'){
            return to_route('designer-task.index')->with(['error' => 'The task can no longer be modified.']);
        }

        $data = $request->validated();

        if($data['draft'] === 'no'){
            $data['status'] = 'approval';
            $data['content_submitted_date'] = now();
        }

        $task->update($data);

        if($data['draft'] === 'yes'){
            $data['status'] = 'progress';
            $data['content_submitted_date'] = null;
            $task->update($data);
            return to_route('designer-task.index')->with(['success' => 'Task Save as Draft']);
        }

        return to_route('designer-task.index')->with(['success' => 'Task Submitted Successfully']);
    }

}
