<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AcademicYearResource;
use App\Models\AcademicYear;
use App\Models\Article;
use App\Models\ArticleView;
use App\Models\Comment;
use App\Models\CommentLike;
use App\Models\FreedomWall;
use App\Models\FreedomWallLike;
use App\Models\Newsletter;
use App\Models\Rating;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        // Determine the selected time period (default to 'daily') and selected academic year
        $timePeriod = $request->input('period', 'daily');
        $selectedAcademicYear = $request->input('academic_year');

        // Initialize date range based on the selected time period
        switch ($timePeriod) {
            case 'weekly':
                $dateFrom = now()->subWeek();
                break;
            case 'monthly':
                $dateFrom = now()->subMonth();
                break;
            case 'ay': // Handle academic year-specific data
                // Fetch the selected academic year
                $academicYear = AcademicYear::find($selectedAcademicYear);
                
                if ($academicYear) {
                    $dateFrom = $academicYear->start_at; // Start date of the academic year
                    $dateTo = $academicYear->end_at; // End date of the academic year
                } else {
                    // Handle case where no academic year is selected or invalid ID is passed
                    return back()->with('error', 'Invalid academic year selected.');
                }
                break;
            default:
                $dateFrom = now()->subDay();
        }

        
        // Fetch counts based on the selected period or academic year range
        $articlesQuery = Article::where('status', 'published')
                                ->where('visibility', 'visible');

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $articlesQuery->whereBetween('published_date', [$dateFrom, $dateTo]);
        } else {
            $articlesQuery->where('published_date', '>=', $dateFrom);
        }
        $articles = $articlesQuery->count();

        // Fetch rate count
        $ratingsQuery = Rating::query(); // Start query without 'visibility' as there's no such field in Rating

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $ratingsQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $ratingsQuery->where('created_at', '>=', $dateFrom);
        }

        $ratings = $ratingsQuery->count();


        // Fetch rate count
        $commentsQuery = Rating::query(); 

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $commentsQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $commentsQuery->where('created_at', '>=', $dateFrom);
        }
        $comments = $commentsQuery->count();

        // Fetch comment likes count
        $commentsLikeQuery = CommentLike::where('is_like', 1);

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $commentsLikeQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $commentsLikeQuery->where('created_at', '>=', $dateFrom);
        }
        $commentsLike = $commentsLikeQuery->count();

        // Fetch comment dislikes count
        $commentsDislikeQuery = CommentLike::where('is_like', 0);

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $commentsDislikeQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $commentsDislikeQuery->where('created_at', '>=', $dateFrom);
        }
        $commentsDislike = $commentsDislikeQuery->count();

        // Fetch Freedom Wall posts count
        $freedomWallQuery = FreedomWall::where('visibility', 'visible');

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $freedomWallQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $freedomWallQuery->where('created_at', '>=', $dateFrom);
        }
        $freedomWall = $freedomWallQuery->count();

        // Fetch Freedom Wall likes count
        $freedomWallLikeQuery = FreedomWallLike::where('is_like', 1);

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $freedomWallLikeQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $freedomWallLikeQuery->where('created_at', '>=', $dateFrom);
        }
        $freedomWallLike = $freedomWallLikeQuery->count();

        // Fetch Freedom Wall dislikes count
        $freedomWallDislikeQuery = FreedomWallLike::where('is_like', 0);

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $freedomWallDislikeQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $freedomWallDislikeQuery->where('created_at', '>=', $dateFrom);
        }
        $freedomWallDislike = $freedomWallDislikeQuery->count();

        // Fetch tasks count
        $tasksQuery = Task::where('status', 'completed');

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $tasksQuery->whereBetween('task_completed_date', [$dateFrom, $dateTo]);
        } else {
            $tasksQuery->where('task_completed_date', '>=', $dateFrom);
        }
        $tasks = $tasksQuery->count();

        // Total article views
        $totalViewsQuery = ArticleView::query();

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $totalViewsQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $totalViewsQuery->where('created_at', '>=', $dateFrom);
        }
        $totalViews = $totalViewsQuery->count();

        // Total newsletters
        $totalNewslettersQuery = Newsletter::query();

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $totalNewslettersQuery->whereBetween('distributed_at', [$dateFrom, $dateTo]);
        } else {
            $totalNewslettersQuery->where('distributed_at', '>=', $dateFrom);
        }
        $totalNewsletters = $totalNewslettersQuery->count();


        // Total reported content wani labot
        $totalReportedArticles = Article::sum('report_count');
        $totalReportedComments = Comment::sum('report_count');
        $totalReportedFreedomWall = FreedomWall::sum('report_count');
        $reportedContent = $totalReportedArticles + $totalReportedComments + $totalReportedFreedomWall;


        $reportData = [
            'articles' => $articles,
            'views' => $totalViews,
            'ratings' => $ratings,
            'comments' => $comments,
            'commentsLike' => $commentsLike,
            'commentsDislike' => $commentsDislike,
            'freedomWall' => $freedomWall,
            'freedomWallLike' => $freedomWallLike,
            'freedomWallDislike' => $freedomWallDislike,
            'tasks' => $tasks,
            'totalNewsletters' => $totalNewsletters,
            'reportedContent' => $reportedContent,
            'timePeriod' => $timePeriod,  // Pass the selected period to the frontend
        ];
        
        $academicYears = AcademicYear::all();
        
        // Return data to the Inertia view
        return inertia('Admin/Dashboard', [
            'dateFrom' => Carbon::parse($dateFrom)->diffForHumans(),
            'reportData' => $reportData,
            'academicYears' => AcademicYearResource::collection($academicYears),
        ]);
    }

}
