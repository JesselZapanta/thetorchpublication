<?php

namespace App\Http\Controllers\Writer;

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
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
class WriterDashboardController extends Controller
{
    public function index(Request $request)
    {

        // Determine the selected time period (default to 'daily') and selected academic year
        $timePeriod = $request->input('period', 'daily');
        $selectedMonth = $request->input('month');
        $selectedAcademicYear = $request->input('academic_year');

        $userId = Auth::user()->id;

        // Error handling: Ensure that academic_year is only provided when period is 'ay'
        if ($timePeriod !== 'ay' && $selectedAcademicYear) {
            return back()->with('error', 'Academic year should only be selected for the "ay" time period.');
        }


        // Initialize date range based on the selected time period
        switch ($timePeriod) {
            case 'weekly':
                $dateFrom = now('Asia/Manila')->subWeek();
                $dateTo = now('Asia/Manila');
                break;
            case 'monthly':
                if ($selectedMonth) {
                    // Handle specific month selection
                    $year = now('Asia/Manila')->year;
                    $dateFrom = Carbon::createFromDate($year, $selectedMonth, 1)->startOfMonth();
                    $dateTo = Carbon::createFromDate($year, $selectedMonth, 1)->endOfMonth();
                } else {
                    $dateFrom = now('Asia/Manila')->subMonth();
                    $dateTo = now('Asia/Manila');
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
                $dateFrom = now('Asia/Manila')->subDay();
                $dateTo = now('Asia/Manila');
        }



        
        // Fetch counts based on the selected period or academic year range
        $articlesQuery = Article::where('status', 'published')
                                ->where('visibility', 'visible')
                                ->where('created_by',  $userId);

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $articlesQuery->whereBetween('published_date', [$dateFrom, $dateTo]);
        } else {
            $articlesQuery->whereBetween('published_date',  [$dateFrom, $dateTo]);
        }
        $articles = $articlesQuery->count();

        // Fetch counts based on the selected period or academic year range
        //edited by
        $articlesQuery = Article::where('status','!=' ,'published')
                                ->where('visibility', 'visible')
                                ->where('created_by',  $userId);

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $articlesQuery->whereBetween('submitted_at', [$dateFrom, $dateTo]);
        } else {
            $articlesQuery->whereBetween('submitted_at',  [$dateFrom, $dateTo]);
        }
        $unpublishedArticles = $articlesQuery->count();

        // Total article views
        $totalViewsQuery = ArticleView::whereHas('article', function ($query) use ($userId) {
                    $query->where('created_by', $userId) // Your articles
                        ->where('status', 'published'); // Only published articles
                });

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $totalViewsQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $totalViewsQuery->whereBetween('created_at',  [$dateFrom, $dateTo]);
        }
        $totalViews = $totalViewsQuery->count();



        // Fetch rate count
        $ratingsQuery = Rating::whereHas('article', function ($query) use ($userId) {
                        $query->where('created_by', $userId) // Your articles
                            ->where('status', 'published'); // Only published articles
                    });


        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $ratingsQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $ratingsQuery->whereBetween('created_at',  [$dateFrom, $dateTo]);
        }

        $ratings = $ratingsQuery->count();


        // Fetch comment count
         // $commentsQuery = Comment::where('user_id',  $userId);
        $commentsQuery = Comment::whereHas('article', function ($query) use ($userId) {
                        $query->where('created_by', $userId) // Your comment
                            ->where('visibility', 'visible'); // Only visible comment
                    });

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $commentsQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $commentsQuery->whereBetween('created_at',  [$dateFrom, $dateTo]);
        }
        $comments = $commentsQuery->count();

        // Fetch comment likes count
        $commentsLikeQuery = CommentLike::where('is_like', 1)
                                ->whereHas('comment', function ($query) use ($userId) {
                                $query->where('user_id', $userId) // Your comment
                                    ->where('visibility', 'visible'); // Only visible comment
                    });
        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $commentsLikeQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $commentsLikeQuery->whereBetween('created_at',  [$dateFrom, $dateTo]);
        }
        $commentsLike = $commentsLikeQuery->count();

        // Fetch comment dislikes count
        $commentsDislikeQuery = CommentLike::where('is_like', 0)
                                ->whereHas('comment', function ($query) use ($userId) {
                                $query->where('user_id', $userId) // Your comment
                                    ->where('visibility', 'visible'); // Only visible comment
                    });
        

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $commentsDislikeQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $commentsDislikeQuery->whereBetween('created_at',  [$dateFrom, $dateTo]);
        }
        $commentsDislike = $commentsDislikeQuery->count();

        // Fetch Freedom Wall posts count
        $freedomWallQuery = FreedomWall::where('visibility', 'visible')
                                            ->where('user_id', $userId);

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $freedomWallQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $freedomWallQuery->whereBetween('created_at',  [$dateFrom, $dateTo]);
        }
        $freedomWall = $freedomWallQuery->count();

        // Fetch Freedom Wall likes count
        $freedomWallLikeQuery = FreedomWallLike::where('is_like', 1)
                                ->whereHas('freedomWall', function ($query) use ($userId) {
                                $query->where('user_id', $userId) // Your freedomWall
                                    ->where('visibility', 'visible'); // Only visible freedomWall
                    });
        

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $freedomWallLikeQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $freedomWallLikeQuery->whereBetween('created_at',  [$dateFrom, $dateTo]);
        }
        $freedomWallLike = $freedomWallLikeQuery->count();

        // Fetch Freedom Wall dislikes count
        $freedomWallDislikeQuery = FreedomWallLike::where('is_like', 0)
                                ->whereHas('freedomWall', function ($query) use ($userId) {
                                $query->where('user_id', $userId) // Your freedomWall
                                    ->where('visibility', 'visible'); // Only visible freedomWall
                    });
        

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $freedomWallDislikeQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
        } else {
            $freedomWallDislikeQuery->whereBetween('created_at',  [$dateFrom, $dateTo]);
        }
        $freedomWallDislike = $freedomWallDislikeQuery->count();

        
        // Fetch tasks count !completed
        $tasksQuery = Task::where('status', '!=' ,'completed')
                                ->where('assigned_to', $userId);

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $tasksQuery->whereBetween('assigned_date', [$dateFrom, $dateTo]);
        } else {
            $tasksQuery->whereBetween('assigned_date',  [$dateFrom, $dateTo]);
        }
        $tasksIncomplete = $tasksQuery->count();

        // Fetch tasks count completed
        $tasksQuery = Task::where('status', 'completed')
                                ->where('assigned_to', $userId);

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $tasksQuery->whereBetween('task_completed_date', [$dateFrom, $dateTo]);
        } else {
            $tasksQuery->whereBetween('task_completed_date',  [$dateFrom, $dateTo]);
        }
        $tasksCompeted = $tasksQuery->count();


        // =============================================================== //
        //Total Articles Per Category
        // Fetch all categories
        $categories = Category::with(['articles' => function($query) use ($timePeriod, $dateFrom, $dateTo, $userId) {
            // Filter articles based on the time period
            if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
                $query->whereBetween('published_date', [$dateFrom, $dateTo]);
            } else {
                // Ensure we handle other cases properly
                $query->whereBetween('published_date',  [$dateFrom, $dateTo]);
            }
            // Limit the number of articles to 10
            // $query->where('created_by', $userId)->limit(10);
            $query->where('created_by', $userId);

            // Apply visibility and status filters to articles
            $query->where('visibility', 'visible')
                ->where('status', 'published');

        }])->where('status', 'active')->get();


        // Return categories with the article count for each
        $categoriesWithCount = $categories->map(function ($category) {
            return [
                'category_name' => $category->name,
                'article_count' => $category->articles->count(),
            ];
        });


        // Fetch all categories with their articles and views filtered by time period
        $categories = Category::with(['articles' => function($query) use ($timePeriod, $dateFrom, $dateTo, $userId) {
            // Filter articles based on the time period
            $query->withCount(['views' => function($viewQuery) use ($dateFrom, $dateTo) {
                $viewQuery->whereBetween('created_at', [$dateFrom, $dateTo]);
            }]);
            // Limit the number of articles to 10
            // $query->where('created_by', $userId)->limit(10);
            $query->where('created_by', $userId);

             // Apply visibility and status filters to articles
            $query->where('visibility', 'visible')
                ->where('status', 'published');
                
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
            'unpublishedArticles' => $unpublishedArticles,
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
            'timePeriod' => $timePeriod,  // Pass the selected period to the frontend

            // Add dateFrom and dateTo to the report data
            'dateFrom' => Carbon::parse($dateFrom)->format('F j, Y'),  // E.g., "September 25, 2024"
            'dateTo' => Carbon::parse($dateTo)->format('F j, Y'),
            'academicYear' => isset($academicYear) ? $academicYear->description : null,
        ];
        
        $academicYears = AcademicYear::all();
        
        // Return data to the Inertia view
        return inertia('Writer/Dashboard', [
            'dateFrom' => Carbon::parse($dateFrom)->diffForHumans(),
            'reportData' => $reportData,
            'categoriesWithCount' => $categoriesWithCount,
            'categoriesWithViewsCount' => $categoriesWithViewsCount,
            'academicYears' => AcademicYearResource::collection($academicYears),
        ]);
    }
}
