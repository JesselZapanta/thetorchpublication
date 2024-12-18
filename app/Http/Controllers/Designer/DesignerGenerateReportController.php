<?php

namespace App\Http\Controllers\Designer;

use App\Http\Controllers\Controller;
use App\Http\Resources\AcademicYearResource;
use App\Models\AcademicYear;
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



        $newsletterQuery = Newsletter::where('status', 'distributed')
                                ->where('visibility', 'visible')
                                ->where('layout_by',  $userId);

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $newsletterQuery->whereBetween('distributed_at', [$dateFrom, $dateTo]);
        } else {
            $newsletterQuery->whereBetween('distributed_at', [$dateFrom, $dateTo]);
        }

        $distributedNewsletters = $newsletterQuery->get(['id','description', 'newsletter_thumbnail_image_path', 'submitted_at', 'distributed_at']);

        $taskQuery = Task::where('status', 'completed')
                                ->where('visibility', 'visible')
                                ->where('layout_by',  $userId);

        if ($timePeriod === 'ay' && isset($dateFrom, $dateTo)) {
            $taskQuery->whereBetween('task_completed_date', [$dateFrom, $dateTo]);
        } else {
            $taskQuery->whereBetween('task_completed_date', [$dateFrom, $dateTo]);
        }
        
        $completedTasks = $taskQuery->get(['id','name', 'task_image_path', 'image_submitted_date', 'task_completed_date']);

        $combinedData = [];

        // Add distributed newsletters
        foreach ($distributedNewsletters as $newsletter) {
            $combinedData[] = [
                'id' => $newsletter->id,
                'description' => $newsletter->description,
                'image' => $newsletter->newsletter_thumbnail_image_path,
                'submitted_at' => Carbon::parse($newsletter->submitted_at)->format('F j, Y'),
                'completed_distributed_at' =>  Carbon::parse($newsletter->distributed_at)->format('F j, Y'),
            ];
        }

        // Add completed tasks
        foreach ($completedTasks as $task) {
            $combinedData[] = [
                'id' => $task->id,
                'description' => $task->name,
                'image' => $task->task_image_path,
                'submitted_at' => Carbon::parse($task->image_submitted_date)->format('F j, Y'),
                'completed_distributed_at' => Carbon::parse( $task->task_completed_date)->format('F j, Y'),
            ];
        }

        
        $academicYears = AcademicYear::all();
        
        // Return data to the Inertia view
        return inertia('Designer/Report', [
            'timePeriod' => $timePeriod,  // Pass the selected period to the frontend
            'dateFrom' => Carbon::parse($dateFrom)->format('F j, Y'),  // E.g., "September 25, 2024"
            'dateTo' => Carbon::parse($dateTo)->format('F j, Y'),
            'academicYear' => isset($academicYear) ? $academicYear->description : null,

            'academicYears' => AcademicYearResource::collection($academicYears),

            'distributedNewsletters' => $distributedNewsletters,
            'completedTasks' => $completedTasks,
            'combinedData' => $combinedData
        ]);
    }
}
