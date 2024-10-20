<?php

namespace App\Http\Controllers\Editor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Editor\EditorUpdateTaskRequest;
use App\Http\Requests\Writer\WriterUpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Models\User;
use App\Models\Word;
use App\Utilities\AhoCorasick;
use Auth;
use Illuminate\Support\Facades\Notification;
use App\Notifications\TaskAssigned;
use Illuminate\Http\Request;

class EditorTaskController extends Controller
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

        return inertia('Editor/Task/Index', [
            'queryParams' => request()->query() ? : null,
            'tasks' => TaskResource::collection($tasks),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $task = Task::where('id',$id)
                    ->where('assigned_to', Auth::user()->id)
                    ->firstOrFail();

        if(!$task){
            return to_route('editor-task.index')->with(['error' => 'Task not found']);
        }

        // if($task->status !== 'pending' && $task->status !== 'content_revision' && $task->status !== 'progress' && $task->status !== 'approval'){
        //     return to_route('editor-task.index')->with(['error' => 'The task can no longer be modified.']);
        // }

        return inertia('Editor/Task/Show', [
            'task' => new TaskResource($task),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EditorUpdateTaskRequest $request, $id)
    {
        $task = Task::find($id);

        if(!$task){
            return to_route('editor-task.index')->with(['error' => 'Task not found']);
        }

        if($task->status !== 'pending' && $task->status !== 'content_revision' && $task->status !== 'progress' && $task->status !== 'approval'){
            return to_route('editor-task.index')->with(['error' => 'The task can no longer be modified.']);
        }

        $data = $request->validated();

        // Build the Trie with bad words
        $badWords = Word::pluck('name')->toArray(); // Adjust if column name changes
        $ahoCorasick = new AhoCorasick();
        foreach ($badWords as $badWord) {
            $ahoCorasick->insert(strtolower($badWord));
        }

        $ahoCorasick->buildFailureLinks();

        // Initialize an array to collect errors
        $errors = [];

        // Check if the article title contains any bad words
        $detectedWords = $ahoCorasick->search(strtolower($data['title']));
        if (!empty($detectedWords)) {
            $errors['title'] = 'The title contains inappropriate content: ' . implode(', ', $detectedWords);
        }

        // Check if the article excerpt contains any bad words
        $detectedWords = $ahoCorasick->search(strtolower($data['excerpt']));
        if (!empty($detectedWords)) {
            $errors['excerpt'] = 'The excerpt contains inappropriate content: ' . implode(', ', $detectedWords);
        }


        //sanitize for base64
        function sanitizeContent($body) {
            // Regular expression to match base64 image data (including jpg, jpeg, png, gif)
            //wa na gamit
            $base64Pattern = '/data:image\/(?:jpeg|jpg|png|gif);base64,[a-zA-Z0-9\/+\r\n]+={0,2}/';
            
            // Regular expression to match <figure>, <oembed>, and <a> tags (removes embedded URLs and links)
            $urlPattern = '/<figure.*?>.*?<\/figure>|<oembed.*?>.*?<\/oembed>|<a.*?>.*?<\/a>/i';
            
            // Remove all base64 image data
            $body = preg_replace($base64Pattern, '', $body);
            
            // Remove all embedded URLs and links (<figure>, <oembed>, and <a> tags)
            return preg_replace($urlPattern, '', $body);
        }

        $sanitizedBody = sanitizeContent($data['body']);


        // Check if the article body contains any bad words
        $detectedWords = $ahoCorasick->search($sanitizedBody);
        if (!empty($detectedWords)) {
            $errors['body'] = 'The body contains inappropriate content: ' . implode(', ', $detectedWords);
        }

        // Check if the article caption contains any bad words
        $detectedWords = $ahoCorasick->search(strtolower($data['caption']));
        if (!empty($detectedWords)) {
            $errors['caption'] = 'The caption contains inappropriate content: ' . implode(', ', $detectedWords);
        }

        // If there are any errors, return them
        if (!empty($errors)) {
            return redirect()->back()->withErrors($errors);
        }


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
            $customMessage = $assignedTo->name . ' submitted a content for the task';

            // Send the email notification to the assigned user
            Notification::send($assignedUser, new TaskAssigned($taskDetails, $customMessage));
        }

        $task->update($data);

        if($data['draft'] === 'yes'){
            $data['status'] = 'progress';
            $data['content_submitted_date'] = null;
            $task->update($data);
            return to_route('editor-task.index')->with(['success' => 'Task Save as Draft']);
        }

        return to_route('editor-task.index')->with(['success' => 'Task Submitted Successfully']);
    }

    public function timeLine($id)
    {
        $task = Task::find($id);

        return inertia('Editor/Task/Timeline', [
            'task' => new TaskResource($task),
        ]);
    }


    public function calendar()
    {
        $tasks = Task::where('status', 'completed')
                            ->where('assigned_to', Auth::user()->id)
                            ->whereNotNull('task_completed_date')
                            ->get(['id','name', 'status', 'task_completed_date']);

        // $tasks = Task::select('id', 'name', 'status', 'assigned_date' ,'task_completed_date')->get();

        // Render the calendar page with tasks passed as props
        return inertia('Editor/Task/MyCalendar', [
            'tasks' => $tasks
        ]);
    }

}
