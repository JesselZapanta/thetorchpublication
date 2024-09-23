<?php

namespace App\Providers;

use App\Models\Article;
use App\Models\Comment;
use App\Models\FreedomWall;
use App\Models\Newsletter;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Auth;
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
        //admin notif badge count
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

         //editor notif badge count
        Inertia::share('EditorBadgeCount', function () {
            // for article
            $pendingArticleCount = Article::where('status', 'pending')->count();
            $revisionArticleCount = Article::where('status', 'revision')->where('edited_by', Auth::user()->id)->count();
            $articleBadgeCount = $pendingArticleCount + $revisionArticleCount;

            // for task
            $pendingTaskCount = Task::where('status', 'pending')->where('assigned_to', Auth::user()->id)->count();
            $revisionTaskCount = Task::where('status', 'content_revision')->where('assigned_to', Auth::user()->id)->count();
            $totalTaskCount = $pendingTaskCount + $revisionTaskCount;


            // for reported Content
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
                'articleBadgeCount' => $articleBadgeCount,
                'totalTaskCount' => $totalTaskCount,
                'totalReportCount' => $totalReportCount,
            ];
        });


         //writer notif badge count
        Inertia::share('WriterBadgeCount', function () {
            // for article
            $rejectedArticleCount = Article::where('status', 'rejected')->where('created_by', Auth::user()->id)->count();

            // // for task
            $pendingTaskCount = Task::where('status', 'pending')->where('assigned_to', Auth::user()->id)->count();
            $revisionTaskCount = Task::where('status', 'content_revision')->where('assigned_to', Auth::user()->id)->count();
            $totalTaskCount = $pendingTaskCount + $revisionTaskCount;

            // for reported Content
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
                'rejectedArticleCount' => $rejectedArticleCount,
                'totalTaskCount' => $totalTaskCount,
                'totalReportCount' => $totalReportCount,
            ];
        });

    }
}
