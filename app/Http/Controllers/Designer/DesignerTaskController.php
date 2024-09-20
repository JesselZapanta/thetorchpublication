<?php

namespace App\Http\Controllers\Designer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Designer\DesignerUpdateTaskRequest;
use App\Http\Requests\Writer\WriterUpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Models\User;
use Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Notification;
use App\Notifications\TaskAssigned;

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

        $sortField = request('sort_field', 'status');
        $sortDirection = request('sort_direction', 'asc');
        

        if(request('name')){
            $query->where('name', 'like', '%'. request('name') . '%');
        }

        if(request('status')){
            $query->where('status', request('status'));
        }

        if(request('priority')){
            $query->where('priority', request('priority'));
        }

        $tasks = $query->where('layout_by', $id)
                        ->where(function ($query) {
                            $query->where('status', 'approved')
                                    ->orWhere('status', 'image_revision')
                                    ->orWhere('status', 'review')
                                    ->orWhere('status', 'completed');
                        })
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

        // if($task->status !== 'approved' && $task->status !== 'image_revision'){
        //     return to_route('designer-task.index')->with(['error' => 'The task status is still in ' . $task->status]);
        // }

        return inertia('Designer/Task/Show', [
            'task' => new TaskResource($task),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(DesignerUpdateTaskRequest $request, $id)
    {
        $task = Task::find($id);

        if(!$task){
            return to_route('designer-task.index')->with(['error' => 'Task not found']);
        }

        if($task->status !== 'approved' && $task->status !== 'image_revision' && $task->status !== 'review'){
            return to_route('designer-task.index')->with(['error' => 'The task can no longer be modified.']);
        }

        $data = $request->validated();

        $image = $data['task_image_path'];

        if ($image) {
                // Delete the old image file if a new one is uploaded
                if ($task->task_image_path) {
                    Storage::disk('public')->delete($task->task_image_path);
                }
                // Store the new image under the 'task/' directory
                $data['task_image_path'] = $image->store('task', 'public');
                $data['image_submitted_date'] = now();
                $data['status'] = 'review';

                 // ==============send email notif ==================//

                // Get the user assigned to the task (assuming there's an 'assigned_to' field)
                $assignedUser = User::find($task->assigned_by);
                $assignedTo = User::find($task->layout_by);

                // Prepare task details for the notification
                $taskDetails = [
                    'task_id' => $task->id,
                    'task_name' => $task->name,
                    'assigned_by_name' => $task->assignedBy->name,
                    'due_date' =>  $task->due_date,
                    'priority' => $task->priority,
                ];

                // Customize the message based on the task status
                $customMessage = $assignedTo->name . ' submitted an image for the task.';

                // Send the email notification to the assigned user
                Notification::send($assignedUser, new TaskAssigned($taskDetails, $customMessage));

            } else {
                // Keep the existing image
                $data['task_image_path'] = $task->task_image_path;
            }


        $task->update($data);

        return to_route('designer-task.index')->with(['success' => 'Image Submitted Successfully']);
    }

    
    public function timeLine($id)
    {
        $task = Task::find($id);

        return inertia('Designer/Task/Timeline', [
            'task' => new TaskResource($task),
        ]);
    }

}
