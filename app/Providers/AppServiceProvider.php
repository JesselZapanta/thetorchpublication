<?php

namespace App\Providers;

use App\Models\Article;
use App\Models\Comment;
use App\Models\ContributorApplication;
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
        // Inertia::share('AdminBadgeCount', function () {
        //     $userCount = User::count();    // Get the user count
        //     $editedCount = Article::where('status', 'edited')->count();
        //     $newsletterPendingCount = Newsletter::where('status', 'pending')->count();

        //     $pendingApprovalTaskCount = Task::where('status', 'approval')->count();
        //     $reviewApprovalTaskCount = Task::where('status', 'review')->count();
        //     $totalTaskCount = $pendingApprovalTaskCount + $reviewApprovalTaskCount;

        //     $totalArticleReportCount = Article::where('visibility', 'visible')
        //                                         ->where('report_count', '>', 0)
        //                                         ->count();
        //     $totalCommentReportCount = Comment::where('visibility', 'visible')
        //                                         ->where('report_count', '>', 0)
        //                                         ->count();
        //     $totalFreedomWallReportCount = FreedomWall::where('visibility', 'visible')
        //                                         ->where('report_count', '>', 0)
        //                                         ->count();

        //     $totalReportCount = $totalArticleReportCount + $totalCommentReportCount + $totalFreedomWallReportCount;

        //     return [
        //         'user' => $userCount,
        //         'editedCount' => $editedCount,
        //         'newsletterPendingCount' => $newsletterPendingCount,
        //         'totalTaskCount' => $totalTaskCount,
        //         'totalReportCount' => $totalReportCount,
        //     ];
        // });

         //Admin notif badge count
        Inertia::share('AdminBadgeCount', function () {
            if (Auth::check() && Auth::user()->role === 'admin') { // Check if user is an admin
                $userCount = User::count();    // Get the user count
                $editedCount = Article::where('status', 'edited')
                                ->where('visibility', 'visible')
                                ->count();
                $newsletterPendingCount = Newsletter::where('status', 'pending')->where('visibility', 'visible')->count();

                $pendingApprovalTaskCount = Task::where('status', 'approval')
                        ->where('visibility', 'visible') 
                        // ->where('assigned_by', Auth::user()->id)
                        ->count();

                $reviewApprovalTaskCount = Task::where('status', 'review')
                        ->where('visibility', 'visible') 
                                // ->where('assigned_by', Auth::user()->id)
                                ->count();
                                
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
                                                    
                $totalApplication = ContributorApplication::where('status', 'pending')
                                                            ->count();

                $totalReportCount = $totalArticleReportCount + $totalCommentReportCount + $totalFreedomWallReportCount;

                return [
                    'user' => $userCount,
                    'editedCount' => $editedCount,
                    'newsletterPendingCount' => $newsletterPendingCount,
                    'totalTaskCount' => $totalTaskCount,
                    'totalReportCount' => $totalReportCount,
                    'totalArticleReportCount' => $totalArticleReportCount,
                    'totalCommentReportCount' => $totalCommentReportCount,
                    'totalFreedomWallReportCount' => $totalFreedomWallReportCount,
                    'totalApplication' => $totalApplication,
                ];
            }

            return null; 
        });

         //editor notif badge count
        Inertia::share('EditorBadgeCount', function () {
                if (Auth::check() && Auth::user()->role === 'editor') { // Check if user is an editor
                // for article//edited by === id or null
                $pendingArticleCount = Article::where('status', 'pending')
                ->where('visibility', 'visible')
                ->where(function ($query) {
                    $query->where('edited_by', auth()->id())
                        ->orWhereNull('edited_by');
                })
                ->count();


                $revisionArticleCount = 0;
                if (Auth::check()) {
                    $revisionArticleCount = Article::where('status', 'revision')
                        ->where('visibility', 'visible')
                        ->where('edited_by', Auth::user()->id)
                        ->count();
                }

                $articleBadgeCount = $pendingArticleCount + $revisionArticleCount;

                // for task
                $pendingTaskCount = 0;
                $revisionTaskCount = 0;

                if (Auth::check()) {
                    $pendingTaskCount = Task::where('status', 'pending')
                        ->where('visibility', 'visible')
                        ->where('assigned_to', Auth::user()->id)
                        ->count();

                    $revisionTaskCount = Task::where('status', 'content_revision')
                        ->where('visibility', 'visible')
                        ->where('assigned_to', Auth::user()->id)
                        ->count();
                }

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
                    'totalArticleReportCount' => $totalArticleReportCount,
                    'totalCommentReportCount' => $totalCommentReportCount,
                    'totalFreedomWallReportCount' => $totalFreedomWallReportCount,
                    'totalReportCount' => $totalReportCount,
                ];
            }
            return null; 
        });


         //writer notif badge count
        Inertia::share('WriterBadgeCount', function () {
             if (Auth::check() && Auth::user()->role === 'writer') { // Check if user is an writer
                // for article
                $rejectedArticleCount = 0;

                if (Auth::check()) {
                    $rejectedArticleCount = Article::where('status', 'rejected')
                        ->where('visibility', 'visible')
                        ->where('created_by', Auth::user()->id)
                        ->count();
                }


                // // for task
                $pendingTaskCount = 0;
                $revisionTaskCount = 0;

                if (Auth::check()) {
                    $userId = Auth::user()->id;

                    $pendingTaskCount = Task::where('status', 'pending')
                        ->where('visibility', 'visible')
                        ->where('assigned_to', $userId)
                        ->count();

                    $revisionTaskCount = Task::where('status', 'content_revision')
                        ->where('visibility', 'visible')
                        ->where('assigned_to', $userId)
                        ->count();
                }

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
                    'totalArticleReportCount' => $totalArticleReportCount,
                    'totalCommentReportCount' => $totalCommentReportCount,
                    'totalFreedomWallReportCount' => $totalFreedomWallReportCount,
                ];
            }
            return null;
        });

        //Designer notif badge count
        Inertia::share('DesignerBadgeCount', function () {

            if (Auth::check() && Auth::user()->role === 'designer') { // Check if user is an designer
                // // for task
                $pendingTaskCount = 0;
                $revisionTaskCount = 0;

                if (Auth::check()) {
                    $userId = Auth::user()->id;

                    $pendingTaskCount = Task::where('status', 'Approved')
                        ->where('visibility', 'visible')
                        ->where('layout_by', $userId)
                        ->count();

                    $revisionTaskCount = Task::where('status', 'image_revision')
                        ->where('visibility', 'visible')
                        ->where('layout_by', $userId)
                        ->count();
                }

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


                $isNewsletter = Article::where('is_newsletter', 'yes')
                                        ->where('visibility', 'visible')
                                        ->count();

                $newsletterRevision = 0;

                if (Auth::check()) {
                    $userId = Auth::user()->id;

                    $newsletterRevision = Newsletter::where('layout_by', $userId)
                                                        ->where('status', 'revision')
                                                        ->count();
                }

                $newsletterRevision =  $newsletterRevision + $isNewsletter;

                return [
                    'totalTaskCount' => $totalTaskCount,
                    'totalReportCount' => $totalReportCount,
                    'totalArticleReportCount' => $totalArticleReportCount,
                    'totalCommentReportCount' => $totalCommentReportCount,
                    'totalFreedomWallReportCount' => $totalFreedomWallReportCount,
                    'isNewsletter' => $isNewsletter,
                    'newsletterRevision' => $newsletterRevision,
                ];
            }
            return null;
        });


        //Student notif badge count
        Inertia::share('StudentBadgeCount', function () {

            if (Auth::check() && (Auth::user()->role === 'student' || Auth::user()->role === 'student_contributor')) {

                $rejectedArticleCount = 0;

                if (Auth::check()) {
                    $rejectedArticleCount = Article::where('status', 'rejected')
                        ->where('visibility', 'visible')
                        ->where('created_by', Auth::user()->id)
                        ->count();


                    $rejectedApplication = ContributorApplication::where('user_id', Auth::user()->id)
                                                                ->where('status', 'rejected')
                                                                ->count();
                }

                return [
                    'rejectedArticleCount' => $rejectedArticleCount,
                    'rejectedApplication' => $rejectedApplication
                ];
            }
            return null;
        });

    }
}
