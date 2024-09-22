<?php

namespace App\Providers;

use App\Models\Article;
use App\Models\Comment;
use App\Models\FreedomWall;
use App\Models\Newsletter;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

        Inertia::share('AdminBadgeCount', function () {
            $userCount = User::count();    // Get the user count
            $editedCount = Article::where('status', 'edited')->count();
            $newsletterPendingCount = Newsletter::where('status', 'pending')->count();

            $pendingApprovalTaskCount = Task::where('status', 'approval')->count();
            $reviewApprovalTaskCount = Task::where('status', 'review')->count();
            $totalTaskCount = $pendingApprovalTaskCount + $reviewApprovalTaskCount;

            $totalArticleReportCount = Article::where('visibility', 'visible')
                                                ->where('report_count', '>', 0)
                                                ->count();
            $totalCommentReportCount = Comment::where('visibility', 'visible')
                                                ->where('report_count', '>', 0)
                                                ->count();
            $totalFreedomWallReportCount = FreedomWall::where('visibility', 'visible')
                                                ->where('report_count', '>', 0)
                                                ->count();

            $totalReportCount = $totalArticleReportCount + $totalCommentReportCount + $totalFreedomWallReportCount;

            return [
                'user' => $userCount,
                'editedCount' => $editedCount,
                'newsletterPendingCount' => $newsletterPendingCount,
                'totalTaskCount' => $totalTaskCount,
                'totalReportCount' => $totalReportCount,
            ];
        });

    }
}
