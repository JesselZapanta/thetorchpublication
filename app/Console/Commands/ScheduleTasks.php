<?php

namespace App\Console\Commands;

use App\Models\Task;
use Illuminate\Console\Command;

class ScheduleTasks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scheduledTasks';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Change the task status to completed';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Fetch tasks scheduled for today
        $tasks = Task::where('status', 'scheduled')
            ->whereDate('task_completed_date', '<=', today()) 
            ->get();

        foreach ($tasks as $task) {
            // Update the task's status to published
            $task->update(['status' => 'completed']);

            // Optionally, you can add additional logic here (e.g., sending notifications)
        }

        $this->info('Tasks status is change to completed');
    }
}
