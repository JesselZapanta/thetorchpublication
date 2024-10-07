<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AcademicYearResource;
use App\Models\AcademicYear;
use App\Models\Article;
use App\Models\ArticleView;
use App\Models\Category;
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
        $selectedMonth = $request->input('month');
        $selectedAcademicYear = $request->input('academic_year');

        // Initialize date range based on the selected period
        switch ($timePeriod) {
            case 'weekly':
                $dateFrom = now()->subWeek();
                $dateTo = now();
                break;
            case 'monthly':
                if ($selectedMonth) {
                    // Handle specific month selection
                    $year = now()->year;
                    $dateFrom = Carbon::createFromDate($year, $selectedMonth, 1)->startOfMonth();
                    $dateTo = Carbon::createFromDate($year, $selectedMonth, 1)->endOfMonth();
                } else {
                    $dateFrom = now()->subMonth();
                    $dateTo = now();
                }
                break;
            case 'ay': 
                $academicYear = AcademicYear::find($selectedAcademicYear);
                if ($academicYear) {
                    $dateFrom = $academicYear->start_at;
                    $dateTo = $academicYear->end_at;
                } else {
                    return back()->with('error', 'Invalid academic year selected.');
                }
                break;
            default:
                $dateFrom = now()->subDay();
                $dateTo = now();
        }

        
        // Fetch the articles based on the date range
        $articlesQuery = Article::where('status', 'published')
                                ->where('visibility', 'visible');

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $articlesQuery->whereBetween('published_date', [$dateFrom, $dateTo]);
        } else {
            $articlesQuery->whereBetween('published_date', [$dateFrom, $dateTo]);
        }

        $articles = $articlesQuery->count();


        // Fetch rate count
        $ratingsQuery = Rating::query(); // Start query without 'visibility' as there's no such field in Rating

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $ratingsQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $ratingsQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        }

        $ratings = $ratingsQuery->count();


        // Fetch comment count
        $commentsQuery = Comment::where('visibility', 'visible');

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $commentsQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $commentsQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        }
        $comments = $commentsQuery->count();

        // Fetch comment likes count
        $commentsLikeQuery = CommentLike::where('is_like', 1);

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $commentsLikeQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $commentsLikeQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        }
        $commentsLike = $commentsLikeQuery->count();

        // Fetch comment dislikes count
        $commentsDislikeQuery = CommentLike::where('is_like', 0);

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $commentsDislikeQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $commentsDislikeQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        }
        $commentsDislike = $commentsDislikeQuery->count();

        // Fetch Freedom Wall posts count
        $freedomWallQuery = FreedomWall::where('visibility', 'visible');

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $freedomWallQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $freedomWallQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        }
        $freedomWall = $freedomWallQuery->count();

        // Fetch Freedom Wall likes count
        $freedomWallLikeQuery = FreedomWallLike::where('is_like', 1);

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $freedomWallLikeQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $freedomWallLikeQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        }
        $freedomWallLike = $freedomWallLikeQuery->count();

        // Fetch Freedom Wall dislikes count
        $freedomWallDislikeQuery = FreedomWallLike::where('is_like', 0);

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $freedomWallDislikeQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $freedomWallDislikeQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        }
        $freedomWallDislike = $freedomWallDislikeQuery->count();

        // Fetch tasks count completed
        $tasksQuery = Task::where('status', 'completed');

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $tasksQuery->whereBetween('task_completed_date', [$dateFrom, $dateTo]);
        } else {
            $tasksQuery->whereBetween('task_completed_date', [$dateFrom, $dateTo]);
        }
        $tasksCompeted = $tasksQuery->count();

        // Fetch tasks count !completed
        $tasksQuery = Task::where('status', '!=' ,'completed')->where('visibility', 'visible');;

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $tasksQuery->whereBetween('assigned_date', [$dateFrom, $dateTo]);
        } else {
            $tasksQuery->whereBetween('assigned_date', [$dateFrom, $dateTo]);
        }
        $tasksIncomplete = $tasksQuery->count();

        // Total article views
        $totalViewsQuery = ArticleView::query();

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $totalViewsQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $totalViewsQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        }
        $totalViews = $totalViewsQuery->count();

        // Total newsletters
        $totalNewslettersQuery = Newsletter::where('visibility', 'visible');

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $totalNewslettersQuery->whereBetween('distributed_at', [$dateFrom, $dateTo]);
        } else {
            $totalNewslettersQuery->whereBetween('distributed_at', [$dateFrom, $dateTo]);
        }
        $totalNewsletters = $totalNewslettersQuery->count();


        // =============================================================== //
        //Total Articles Per Category
        // Fetch all categories
        $categories = Category::with(['articles' => function($query) use ($timePeriod, $dateFrom, $dateTo) {
            // Filter articles based on the time period
            if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
                $query->whereBetween('published_date', [$dateFrom, $dateTo]);
            } else {
                // Ensure we handle other cases properly
                $query->where('published_date', [$dateFrom, $dateTo]);
            }
            // // Limit the number of articles to 10
            // $query->limit(10);
        }])->where('status', 'active')->get();


        // Return categories with the article count for each
        $categoriesWithCount = $categories->map(function ($category) {
            return [
                'category_name' => $category->name,
                'article_count' => $category->articles->count(),
            ];
        });


        // Fetch all categories with their articles and views filtered by time period
        $categories = Category::with(['articles' => function($query) use ($timePeriod, $dateFrom, $dateTo) {
            // Filter articles based on the time period
            $query->withCount(['views' => function($viewQuery) use ($dateFrom, $dateTo) {
                $viewQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
            }]);

        }])->where('status', 'active')->get();

        // Map categories to get total article view count per category
        $categoriesWithViewsCount = $categories->map(function ($category) {
            $totalViews = $category->articles->sum('views_count');
            return [
                'category_name' => $category->name,
                'article_view_count' => $totalViews
            ];
        });



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
            'tasksCompeted' => $tasksCompeted,
            'tasksIncomplete' => $tasksIncomplete,
            'totalNewsletters' => $totalNewsletters,
            'timePeriod' => $timePeriod,  // Pass the selected period to the frontend

            // Add dateFrom and dateTo to the report data
            'dateFrom' => Carbon::parse($dateFrom)->format('F j, Y'),  // E.g., "September 25, 2024"
            'dateTo' => Carbon::parse($dateTo)->format('F j, Y'),
            'academicYear' => isset($academicYear) ? $academicYear->description : null,
        ];
        
        $academicYears = AcademicYear::all();
        
        // Return data to the Inertia view
        return inertia('Admin/Dashboard', [
            'dateFrom' => Carbon::parse($dateFrom)->diffForHumans(),
            'reportData' => $reportData,
            'categoriesWithCount' => $categoriesWithCount,
            'categoriesWithViewsCount' => $categoriesWithViewsCount,
            'academicYears' => AcademicYearResource::collection($academicYears),
        ]);
    }

    
}
