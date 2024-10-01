<?php

namespace App\Console\Commands;

use App\Models\Task;
use App\Notifications\TaskReminder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;
use Carbon\Carbon;

class SendTaskNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'taskpastdue';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send mail notification for past due tasks.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Fetch all tasks that are overdue
        $tasks = Task::where('due_date', '<', now())->get();

        // Custom overdue message
        $customOverdueMessage = 'Reminder: You have a task that is now overdue. This task was expected to be completed by the assigned due date, and it is important that it is addressed as soon as possible. Please review the task details and take the necessary steps to complete it at your earliest convenience to prevent any further delays. Your attention to this matter is highly appreciated.';

        // Loop through each task
        foreach ($tasks as $task) {
            $assignTo = $task->assignedTo;
            $layoutBy = $task->layoutBy;
            $taskStatus = $task->status;

            // Prepare task details for the notification
            $taskDetails = [
                'task_id' => $task->id,
                'task_name' => $task->name,
                'assigned_by_name' => $task->assignedBy->name,
                'due_date' =>  $task->due_date,
                'priority' => $task->priority,
            ];

            // Check the task status and send notifications accordingly
            if (in_array($taskStatus, ['pending', 'progress', 'content_revision'])) {
                // Send notification to the assignee
                Notification::send($assignTo, new TaskReminder($taskDetails, $customOverdueMessage));
            }

            if (in_array($taskStatus, ['approved', 'image_revision'])) {
                // Send notification to the layout designer
                Notification::send($layoutBy, new TaskReminder($taskDetails, $customOverdueMessage));
            }
        }

        $this->info('Overdue task notifications sent successfully.');
    }
}
