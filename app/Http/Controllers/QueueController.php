<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;

class QueueController extends Controller
{
    public function manageQueue($action)
{
    switch ($action) {
        case 'start':
            // Start the queue
            Artisan::call('queue:work --tries=3 --timeout=0');
            break;

        case 'pause':
            // Pause the queue (manually)
            Queue::pause();
            break;

        case 'resume':
            // Resume the queue
            Queue::resume();
            break;

        default:
            return redirect()->back()->withErrors(['error' => 'Invalid action.']);
    }

    return redirect()->back()->with('success', 'Queue has been managed.');
}

public function deleteAllJobs()
{
    DB::table('jobs')->truncate(); // Truncate the jobs table
    return redirect()->back()->with('success', 'All jobs have been deleted.');
}
}
