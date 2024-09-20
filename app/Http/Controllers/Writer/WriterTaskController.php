<?php

namespace App\Http\Controllers\Writer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Writer\WriterUpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Models\User;
use Auth;
use Illuminate\Support\Facades\Notification;
use App\Notifications\TaskAssigned;
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

        $tasks = $query->where('assigned_to', $id)
                        ->orderBy($sortField, $sortDirection) 
                        ->paginate(10)
                        ->onEachSide(1);

        return inertia('Writer/Task/Index', [
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
            return to_route('writer-task.index')->with(['error' => 'Task not found']);
        }

        // if($task->status !== 'pending' && $task->status !== 'content_revision' && $task->status !== 'progress' && $task->status !== 'approval'){
        //     return to_route('writer-task.index')->with(['error' => 'The task can no longer be modified.']);
        // }

        return inertia('Writer/Task/Show', [
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
            return to_route('writer-task.index')->with(['error' => 'Task not found']);
        }

        if($task->status !== 'pending' && $task->status !== 'content_revision' && $task->status !== 'progress' && $task->status !== 'approval'){
            return to_route('writer-task.index')->with(['error' => 'The task can no longer be modified.']);
        }

        $data = $request->validated();

        if($data['draft'] === 'no'){
            $data['status'] = 'approval';
            $data['content_submitted_date'] = now();

            // ==============send email notif ==================//

            // Get the user assigned to the task (assuming there's an 'assigned_to' field)
            $assignedUser = User::find($task->assigned_by);
            $assignedTo = User::find($task->assigned_to);

            // Prepare task details for the notification
            $taskDetails = [
                'task_id' => $task->id,
                'task_name' => $task->name,
                'assigned_by_name' => $task->assignedBy->name,
                'due_date' =>  $task->due_date,
                'priority' => $task->priority,
            ];

            // Customize the message based on the task status
            $customMessage = $assignedTo->name . ' submitted a content for the task.';

            // Send the email notification to the assigned user
            Notification::send($assignedUser, new TaskAssigned($taskDetails, $customMessage));
        }

        $task->update($data);

        if($data['draft'] === 'yes'){
            $data['status'] = 'progress';
            $data['content_submitted_date'] = null;
            $task->update($data);
            return to_route('writer-task.index')->with(['success' => 'Task Save as Draft']);
        }

        return to_route('writer-task.index')->with(['success' => 'Task Submitted Successfully']);
    }

    public function timeLine($id)
    {
        $task = Task::find($id);

        return inertia('Writer/Task/Timeline', [
            'task' => new TaskResource($task),
        ]);
    }

}
