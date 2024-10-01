<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSubmittedTaskRequest;
use App\Http\Resources\AcademicYearResource;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use App\Models\AcademicYear;
use App\Models\Article;
use App\Models\Category;
use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\User;
use App\Notifications\TaskReminder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Notification;
use App\Notifications\TaskAssigned;

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

        //assigned To
        if (request('assigned_to')) {
            // Join with the users table to search by name
            $query->whereHas('assignedTo', function ($q) {
                $q->where('name', 'like', '%' . request('assigned_to') . '%');
            });
        }

        //layoutBy
        if (request('layout_by')) {
            // Join with the users table to search by name
            $query->whereHas('layoutBy', function ($q) {
                $q->where('name', 'like', '%' . request('layout_by') . '%');
            });
        }

        $tasks = $query->orderBy($sortField, $sortDirection)
                    ->where('assigned_by', Auth::user()->id)
                    ->paginate(10)
                    ->onEachSide(1);
    
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

         // $activeAy = AcademicYear::where('status', 'active')->first();//for non admin
        $activeAy = AcademicYear::all();//for admin

        if (!$activeAy) {
            $activeAy = AcademicYear::orderBy('created_at', 'desc')->first();
        }

        return inertia('Admin/Task/Create', [
            'users' => UserResource::collection($users),
            'designers' => UserResource::collection($designers),
            'categories' => UserResource::collection($categories),
            'activeAy' => AcademicYearResource::collection($activeAy),//for admin
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();
        $id = Auth::user()->id;

        $data['assigned_by'] = $id; // who assigns the task
        $data['assigned_date'] = now(); // date the task is assigned

        // Create the task
        $task = Task::create($data);

        // ==============send email notif ==================//

        // Get the user assigned to the task (assuming there's an 'assigned_to' field)
        $assignedUser = User::find($data['assigned_to']);

        // Prepare task details for the notification
        $taskDetails = [
            'task_id' => $task->id,
            'task_name' => $task->name,
            'assigned_by_name' => $task->assignedBy->name,
            'due_date' => $data['due_date'],
            'priority' => $task->priority,
        ];

        // Customize the message based on the task status
        $customMessage = 'You have been assigned a new task.';

        // Send the email notification to the assigned user
        Notification::send($assignedUser, new TaskAssigned($taskDetails, $customMessage));

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
     * Display the specified resource.
     */
    public function timeLine($id)
    {
        $task = Task::find($id);

        return inertia('Admin/Task/Timeline', [
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

         // $activeAy = AcademicYear::where('status', 'active')->first();//for non admin
        $activeAy = AcademicYear::all();//for admin

        if (!$activeAy) {
            $activeAy = AcademicYear::orderBy('created_at', 'desc')->first();
        }

        return inertia('Admin/Task/Edit', [
            'task' => new TaskResource($task),
            'users' => UserResource::collection($users),
            'designers' => UserResource::collection($designers),
            'categories' => UserResource::collection($categories),
            'activeAy' => AcademicYearResource::collection($activeAy),
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

         // ==============send email notif ==================//

        // Get the user assigned to the task (assuming there's an 'assigned_to' field)
        $assignedUser = User::find($data['assigned_to']);

        // Prepare task details for the notification
        $taskDetails = [
            'task_id' => $task->id,
            'task_name' => $task->name,
            'assigned_by_name' => $task->assignedBy->name,
            'due_date' => $data['due_date'],
            'priority' => $task->priority,
        ];

        // Customize the message based on the task status
        $customMessage = 'The task has been modified.';

        // Send the email notification to the assigned user
        Notification::send($assignedUser, new TaskAssigned($taskDetails, $customMessage));


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

        if($task->status === 'completed'){
            return to_route('admin-task.index')->with(['error' => 'Task is already completed.']);
        }

        // Get the validated data
        $data = $request->validated();

        // Set content_revision_date or content_approved_date based on the new status
        if($data['status'] === 'content_revision'){
            $data['content_revision_date'] = now();
            $data['content_approved_date'] = null;

            // ==============send email notif ==================//

            // Get the user assigned to the task (assuming there's an 'assigned_to' field)
            $assignedUser = User::find($task->assigned_to);

            // Prepare task details for the notification
            $taskDetails = [
                'task_id' => $task->id,
                'task_name' => $task->name,
                'assigned_by_name' => $task->assignedBy->name,
                'due_date' =>  $task->due_date,
                'priority' => $task->priority,
            ];

            // Customize the message based on the task status
            $customMessage = 'The task content needed revision.';

            // Send the email notification to the assigned user
            Notification::send($assignedUser, new TaskAssigned($taskDetails, $customMessage));

        }

        //task status set to approved status date
        if($data['status'] === 'approved'){
            $data['content_approved_date'] = now();

            // ==============send email notif ==================//

            // Get the user assigned to the task (assuming there's an 'assigned_to' field)
            $assignedUser = User::find($task->assigned_to);

            // Prepare task details for the notification
            $taskDetails = [
                'task_id' => $task->id,
                'task_name' => $task->name,
                'assigned_by_name' => $task->assignedBy->name,
                'due_date' =>  $task->due_date,
                'priority' => $task->priority,
            ];

            // Customize the message based on the task status
            $customMessage = 'The task content is approved.';

            // Send the email notification to the assigned user
            Notification::send($assignedUser, new TaskAssigned($taskDetails, $customMessage));
        }

        //task status set to image revision status date
        if($data['status'] === 'image_revision'){
            $data['image_revision_date'] = now();

             // ==============send email notif ==================//

            // Get the user assigned to the task (assuming there's an 'assigned_to' field)
            $assignedUser = User::find($task->layout_by);

            // Prepare task details for the notification
            $taskDetails = [
                'task_id' => $task->id,
                'task_name' => $task->name,
                'assigned_by_name' => $task->assignedBy->name,
                'due_date' =>  $task->due_date,
                'priority' => $task->priority,
            ];

            // Customize the message based on the task status
            $customMessage = 'The submitted image needed revision.';

            // Send the email notification to the assigned user
            Notification::send($assignedUser, new TaskAssigned($taskDetails, $customMessage));
        }

        //task completed date
        if($data['status'] === 'completed'){
            $data['task_completed_date'] = now();


            // ==============send email notif ==================//

            // Get the user assigned to the task (assuming there's an 'assigned_to' field)
            $assignedUser = User::find($task->layout_by);

            // Prepare task details for the notification
            $taskDetails = [
                'task_id' => $task->id,
                'task_name' => $task->name,
                'assigned_by_name' => $task->assignedBy->name,
                'due_date' =>  $task->due_date,
                'priority' => $task->priority,
            ];

            // Customize the message based on the task status
            $customMessage = 'The tast is completed and published.';

            // Send the email notification to the assigned user
            Notification::send($assignedUser, new TaskAssigned($taskDetails, $customMessage));
        }

        // Update the task
        $task->update($data);

        // dd($task);
        

        if($data['status'] === 'completed'){
            
            $article = new Article();

             // Map task data to article fields
            $article->category_id = $task->category_id;
            $article->academic_year_id = $task->academic_year_id;
            $article->title = $task->title;
            $article->excerpt = $task->excerpt;
            $article->body = $task->body;
            $article->status = 'published'; // Set article status to published
            $article->published_date = now();
            $article->is_anonymous = 'no';
            $article->caption = $task->caption;
            $article->article_image_path = $task->task_image_path;
            $article->layout_by = $task->layout_by;
            $article->created_by = $task->assigned_by;

            // Save the new article
            $article->save();

            return to_route('admin-task.index')->with(['success' => 'The tast is completed and published.']);
        }

        // Check the status after update and redirect with appropriate message
        if($data['status'] === 'content_revision'){
            return to_route('admin-task.index')->with(['success' => 'The task needed revision.']);
        }

        if($data['status'] === 'image_revision'){
            return to_route('admin-task.index')->with(['success' => 'The image task needed revision.']);
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


    // tasl calendar

    public function calendar()
    {
        $tasks = Task::where('status', 'completed')
                            ->whereNotNull('task_completed_date')
                            ->get(['id','name', 'status', 'task_completed_date']);

        // $tasks = Task::select('id', 'name', 'status', 'assigned_date' ,'task_completed_date')->get();

        // Render the calendar page with tasks passed as props
        return inertia('Admin/Task/MyCalendar', [
            'tasks' => $tasks
        ]);
    }



    // for testing 

    public function remind($id)
    {   
        $task = Task::find($id);
        

        $assignTo = $task->assignedTo;
        $layoutBy = $task->layoutBy;
        $due = $task->due_date;

        $taskDetails = [
                'task_id' => $task->id,
                'task_name' => $task->name,
                'assigned_by_name' => $task->assignedBy->name,
                'due_date' =>  $task->due_date,
                'priority' => $task->priority,
            ];

        // dd($taskDetails);

        $customOverdueMessage = 'Reminder: You have a task that is now overdue. This task was expected to be completed by the assigned due date, and it is important that it is addressed as soon as possible. Please review the task details and take the necessary steps to complete it at your earliest convenience to prevent any further delays. Your attention to this matter is highly appreciated.';

        $customReminderMessage = 'Reminder: You have a unfinished task that requires your immediate attention. This task is important and has been awaiting completion. Please take a moment to review the details and complete it at your earliest convenience to avoid any potential delays or complications. Your prompt action is greatly appreciated.';

        $taskStatus = $task->status;

        if($taskStatus === 'completed'){
            return to_route('admin-task.index')->with(key: ['error' => 'Task is already completed.']);
        }

        //past due

        if($due < now()){
            //to assignee
            if (in_array($taskStatus, ['pending', 'progress', 'content_revision'])) {
                Notification::send($assignTo, new TaskReminder($taskDetails, $customOverdueMessage));
            }

            //to desinger sa tig layout
            if (in_array($taskStatus, ['approved', 'image_revision'])) {
                Notification::send($layoutBy, new TaskReminder($taskDetails, $customOverdueMessage));
            }

            return to_route('admin-task.index')->with(['success' => 'Reminders sent successfully.']);
        }
        
        
        // not past due
        if($due < now()){
             //to assignee
            if (in_array($taskStatus, ['pending', 'progress', 'content_revision'])) {
                Notification::send($assignTo, new TaskReminder($taskDetails, $customReminderMessage));
            }

            //to desinger sa tig layout
            if (in_array($taskStatus, ['approved', 'image_revision'])) {
                Notification::send($layoutBy, new TaskReminder($taskDetails, $customReminderMessage));
            }

            return to_route('admin-task.index')->with(['success' => 'Reminders sent successfully.']);
        }


        // Send the email notification to the assigned user
        // Notification::send($assignTo, new TaskReminder($taskDetails, $customOverdueMessage));
    }

}
