<?php

namespace App\Http\Controllers\Student;

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

use Barryvdh\DomPDF\Facade\Pdf;

class StudentGenerateReportController extends Controller
{
    public function report(Request $request)
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
                $dateFrom = 'Asia/Manila'()->subWeek();
                $dateTo = 'Asia/Manila'();
                break;
            case 'monthly':
                if ($selectedMonth) {
                    // Handle specific month selection
                    $year = 'Asia/Manila'()->year;
                    $dateFrom = Carbon::createFromDate($year, $selectedMonth, 1)->startOfMonth();
                    $dateTo = Carbon::createFromDate($year, $selectedMonth, 1)->endOfMonth();
                } else {
                    $dateFrom = 'Asia/Manila'()->subMonth();
                    $dateTo = 'Asia/Manila'();
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
                $dateFrom = 'Asia/Manila'()->subDay();
                $dateTo = 'Asia/Manila'();
        }


        $articlesQuery = Article::where('status', 'published')
                                ->where('visibility', 'visible')
                                ->where('created_by',  $userId);

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $articlesQuery->whereBetween('published_date', [$dateFrom, $dateTo]);
        } else {
            $articlesQuery->whereBetween('published_date',  [$dateFrom, $dateTo]);
        }

        $writenArticlesDetais = $articlesQuery->get(['id', 'title', 'article_image_path', 'submitted_at', 'published_date'])->map(function ($article) {
            return [
                'id' => $article->id,
                'title' => $article->title,
                'article_image_path' => $article->article_image_path,
                'submitted_at' => $article->submitted_at ? Carbon::parse($article->submitted_at)->format('F j, Y') : null,  // Format or set null if empty
                'published_date' => $article->published_date ? Carbon::parse($article->published_date)->format('F j, Y') : null,  // Format or set null if empty
            ];
        });
        
        
        $academicYears = AcademicYear::all();
        
        // Return data to the Inertia view
        return inertia('Student/Report', [
            'timePeriod' => $timePeriod,  // Pass the selected period to the frontend
            'dateFrom' => Carbon::parse($dateFrom)->format('F j, Y'),  // E.g., "September 25, 2024"
            'dateTo' => Carbon::parse($dateTo)->format('F j, Y'),
            'academicYear' => isset($academicYear) ? $academicYear->description : null,

            'academicYears' => AcademicYearResource::collection($academicYears),

            'writenArticlesDetais' => $writenArticlesDetais
        ]);
    }
}
