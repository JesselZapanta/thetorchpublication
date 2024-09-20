<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Comment;
use App\Models\FreedomWall;
use App\Models\Task;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        // Determine time period (default to 'daily')
        $timePeriod = $request->input('period', 'daily');
        
        // Set the date range based on the selected time period
        switch ($timePeriod) {
            case 'weekly':
                $dateFrom = now()->subWeek();
                break;
            case 'monthly':
                $dateFrom = now()->subMonth();
                break;
            case 'ay': // Custom case if 'ay' has specific meaning (e.g., academic year)
                $dateFrom = now()->subYear(); // Example: Last year
                break;
            default:
                $dateFrom = now()->subDay();
        }

        // Fetch counts based on dynamic date range
        $articles = Article::where('status', 'published')
                            ->where('visibility', 'visible')
                            ->where('created_at', '>=', $dateFrom)
                            ->count();

        $comments = Comment::where('visibility', 'visible')
                            ->where('created_at', '>=', $dateFrom)
                            ->count();

        $freedomWall = FreedomWall::where('visibility', 'visible')
                                    ->where('created_at', '>=', $dateFrom)
                                    ->count();

        $tasks = Task::where('status', 'completed')
                            ->where('task_completed_date', '>=', $dateFrom)
                            ->count();

        // Total reported content
        $totalReportedArticles = Article::sum('report_count');
        $totalReportedComments = Comment::sum('report_count');
        $totalReportedFreedomWall = FreedomWall::sum('report_count');
        $reportedContent = $totalReportedArticles + $totalReportedComments + $totalReportedFreedomWall;

        $totalViews = Article::sum('views');

        // Return data to the Inertia view
        return inertia('Admin/Dashboard', [
            'articles' => $articles,
            'comments' => $comments,
            'freedomWall' => $freedomWall,
            'tasks' => $tasks,
            'views' => $totalViews,
            'reportedContent' => $reportedContent,
            'timePeriod' => $timePeriod,  // Pass the selected period to the frontend
        ]);
    }
}
