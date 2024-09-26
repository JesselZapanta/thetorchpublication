<?php

namespace App\Http\Controllers\Designer;

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

class DesignerGenerateReportController extends Controller
{
    public function report(Request $request)
    {
        // Determine the selected time period (default to 'daily') and selected academic year
        $timePeriod = $request->input('period', 'daily');
        $selectedAcademicYear = $request->input('academic_year');

        $userId = Auth::user()->id;

        // Error handling: Ensure that academic_year is only provided when period is 'ay'
        if ($timePeriod !== 'ay' && $selectedAcademicYear) {
            return back()->with('error', 'Academic year should only be selected for the "ay" time period.');
        }


        // Initialize date range based on the selected time period
        switch ($timePeriod) {
            case 'weekly':
                $dateFrom = now()->subWeek();
                $dateTo = now(); // Set dateTo to now for monthly
                break;
            case 'monthly':
                $dateFrom = now()->subMonth();
                 $dateTo = now(); // Set dateTo to now for monthly
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
                $dateTo = now(); // Default to now for daily
        }


        $articlesQuery = Newsletter::where('status', 'distributed')
                                ->where('visibility', 'visible')
                                ->where('layout_by',  $userId);

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $articlesQuery->whereBetween('distributed_at', [$dateFrom, $dateTo]);
        } else {
            $articlesQuery->where('distributed_at', '>=', $dateFrom);
        }
        $distributedNewsletters = $articlesQuery->get(['id','description', 'newsletter_thumbnail_image_path', 'submitted_at', 'distributed_at']);
        
        $academicYears = AcademicYear::all();
        
        // Return data to the Inertia view
        return inertia('Designer/Report', [
            'timePeriod' => $timePeriod,  // Pass the selected period to the frontend
            'dateFrom' => Carbon::parse($dateFrom)->format('F j, Y'),  // E.g., "September 25, 2024"
            'dateTo' => Carbon::parse($dateTo)->format('F j, Y'),
            'academicYear' => isset($academicYear) ? $academicYear->description : null,

            'academicYears' => AcademicYearResource::collection($academicYears),

            'distributedNewsletters' => $distributedNewsletters
        ]);
    }
}
