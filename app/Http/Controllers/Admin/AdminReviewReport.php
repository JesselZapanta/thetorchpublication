<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CommentResource;
use App\Http\Resources\FreedomWallResource;
use App\Http\Resources\NewsletterResource;
use App\Http\Resources\TaskResource;
use App\Models\Article;
use App\Models\Comment;
use App\Models\FreedomWall;
use App\Models\Newsletter;
use App\Models\Task;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


class AdminReviewReport extends Controller
{

    public function article()
    {   
        $query = Article::query();

        $sortField = request('sort_field', 'report_count');
        $sortDirection = request('sort_direction', 'desc');
        
        // Apply search filters if present
        if (request('title')) {
            $query->where('title', 'like', '%' . request('title') . '%');
        }
        
        if (request('visibility')) {
            $query->where('visibility', request('visibility'));
        }

        // Ensure proper grouping with orWhere for visibility
        // Tanan ni siya
        // $query->where(function($q) {
        //     $q->where('report_count', '>', 0)
        //         ->orWhere('visibility', 'hidden');
        // });

        // Ensure proper grouping with orWhere for visibility
        $query->where(function($q) {
            $q->where('report_count', '>', 0)
                ->orWhere(function($subQuery) {
                    $subQuery->where('visibility', 'hidden')
                            ->where('archive_by', auth()->id()); // Ensure only the archiver can see hidden items
                });
        });

         // Ensure proper grouping with orWhere for visibility
         //only reported and own
        // $query->where(function ($q) {
        //     $authId = auth()->id();  // Get the authenticated user's ID
            
        //     $q->where(function ($q1) {
        //         // Get articles where visibility is hidden and report_count > 0
        //         $q1->where('report_count', '>', 0)
        //         ->where('visibility', 'hidden');
        //     })->orWhere(function ($q2) use ($authId) {
        //         // Get articles where visibility is hidden, report_count == 0, and createdBy matches the authenticated user
        //         $q2->where('report_count', 0)
        //         ->where('visibility', 'hidden')
        //         ->whereHas('createdBy', function ($query) use ($authId) {
        //             $query->where('id', $authId);
        //         });
        //     });
        // });

        // Apply sorting
        $reportedArticle = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia('Admin/Review/Article/Index', [
            'reportedArticle' => ArticleResource::collection($reportedArticle),
            'queryParams' => request()->query() ?: null,
        ]);
    }
    
    public function showArticle($slug)
    {
        // $article = Article::find($id);
        $article = Article::where('slug', $slug)
            ->where(function($q) {
                $q->where('report_count', '>', 0)
                ->orWhere(function($subQuery) {
                    $subQuery->where('visibility', 'hidden')
                            ->where('archive_by', auth()->id()); // Ensure only the archiver can see hidden items
                });
            })
            ->firstOrFail();


        return inertia('Admin/Review/Article/Show', [
            'article' => new ArticleResource($article),
        ]);
    }
    public function hideArticle($id)
    {
        $article = Article::findOrFail($id);

        if(!$article){
            return back()->with('error', 'Article not found.');
        }

        $article->update(['visibility' => 'hidden']);
        $article->update(['archive_by' => Auth::user()->id ]);

        return to_route('admin-review-report-article.index')->with(['success' => 'Archive successfully.']);
    }
    public function restoreArticle($id)
    {
        $article = Article::findOrFail($id);

        if(!$article){
            return back()->with('error', 'Article not found.');
        }

        $article->update(['archive_by' => null ]);
        $article->update(['visibility' => 'visible']);

        return to_route('admin-review-report-article.index')->with(['success' => 'Restore successfully.']);
    }

    public function rejectArticleReport($id)
    {
        $article = Article::findOrFail($id);

        if(!$article){
            return back()->with('error', 'Article not found.');
        }

        $article->update(['visibility' => 'visible']);
        $article->update(['report_count' => 0]);

        return to_route('admin-review-report-article.index')->with(['success' => 'Reject successfully.']);
    }

    public function destroyArticle($id)
    {
        $article = Article::findOrFail($id);

        if(!$article){
            return back()->with('error', 'Article not found.');
        }

        $article->delete();

        if ($article->article_image_path) {
            // Delete the specific old image file
            Storage::disk('public')->delete($article->article_image_path);
        }

        return to_route('admin-review-report-article.index')->with(['success' => 'Delete successfully.']);
    }

    //=====================================Comment=========================================//

    public function comment()
    {   
        $query = Comment::query();

        $sortField = request('sort_field', 'report_count');
        $sortDirection = request('sort_direction', 'desc');
        
        // Apply search filters if present
        if (request('body')) {
            $query->where('body', 'like', '%' . request('body') . '%');
        }
        
        if (request('visibility')) {
            $query->where('visibility', request('visibility'));
        }

        // Ensure proper grouping with orWhere for visibility
        // $query->where(function($q) {
        //     $q->where('report_count', '>', 0)
        //         ->orWhere('visibility', 'hidden');
        // });

        // Ensure proper grouping with orWhere for visibility
        $query->where(function($q) {
            $q->where('report_count', '>', 0)
                ->orWhere(function($subQuery) {
                    $subQuery->where('visibility', 'hidden')
                            ->where('archive_by', auth()->id()); // Ensure only the archiver can see hidden items
                });
        });

        // Apply sorting
        $reportedArticle = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia('Admin/Review/Comment/Index', [
            'reportedComments' => CommentResource::collection($reportedArticle),
            'queryParams' => request()->query() ? : null,
        ]);
    }

    public function showComment($comment_id )
    {
        // $comment = Comment::findOrFail($comment_id);

        $comment = Comment::where('id', $comment_id)
            ->where(function($q) {
                $q->where('report_count', '>', 0)
                ->orWhere(function($subQuery) {
                    $subQuery->where('visibility', 'hidden')
                            ->where('archive_by', auth()->id()); // Ensure only the archiver can see hidden items
                });
            })
            ->firstOrFail();

        return inertia('Admin/Review/Comment/Show', [
            'comment' => new CommentResource($comment),
        ]);
    }

    public function hideComment($id)
    {
        // dd($id);
        $comment = Comment::findOrFail($id);

        if(!$comment){
            return back()->with('error', 'Comment not found.');
        }

        $comment->update(['visibility' => 'hidden']);
        $comment->update(['archive_by' => Auth::user()->id ]);

        return to_route('admin-review-report-comment.index')->with(['success' => 'Archive successfully.']);
    }
    public function restoreComment($id)
    {
        $comment = Comment::findOrFail($id);

        if(!$comment){
            return back()->with('error', 'Comment not found.');
        }

        $comment->update(['archive_by' => null ]);
        $comment->update(['visibility' => 'visible']);

        return to_route('admin-review-report-comment.index')->with(['success' => 'Restore successfully.']);
    }

    public function rejectCommentReport($id)
    {
        $comment = Comment::findOrFail($id);

        if(!$comment){
            return back()->with('error', 'Comment not found.');
        }

        $comment->update(['visibility' => 'visible']);
        $comment->update(['report_count' => 0]);

        return to_route('admin-review-report-comment.index')->with(['success' => 'Reject successfully.']);
    }

    public function destroyComment($id)
    {
        // dd($id);
        $comment = Comment::findOrFail($id);

        if(!$comment){
            return back()->with('error', 'Comment not found.');
        }

        $comment->delete();

        return to_route('admin-review-report-comment.index')->with(['success' => 'Delete successfully.']);
    }

    //=====================================Freedom Wall=========================================//

    public function freedomWall()
    {   

        $query = FreedomWall::query();

        $sortField = request('sort_field', 'report_count');
        $sortDirection = request('sort_direction', 'desc');
        
        // Apply search filters if present
        if (request('body')) {
            $query->where('body', 'like', '%' . request('body') . '%');
        }
        
        if (request('visibility')) {
            $query->where('visibility', request('visibility'));
        }

         // Get all FreedomWall entries where:
        // 1. reports_count > 0 (withCount relationship)
        // 2. visibility is set to 'hidden'
        //this is a trial func

        //todo add to othther
        $query->where(function ($q) {
            $q->whereHas('reports', function ($subQuery) {
                $subQuery->where('id', '>', 0); // Report count > 0
            })
            ->orWhere(function ($nestedQuery) {
                $nestedQuery->where('visibility', 'hidden')
                            ->where('user_id', Auth::user()->id);
            });
        });



        // Apply sorting
        $reportedFreedomWall = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia('Admin/Review/FreedomWall/Index', [
            'reportedFreedomWall' => FreedomWallResource::collection($reportedFreedomWall),
            'queryParams' => request()->query() ? : null,
        ]);
    }

    public function showFreedomWall($id)
    {
        // $entry = FreedomWall::findOrFail($id);

        $freedomWall = FreedomWall::where('id', $id)
            ->where(function ($q) {
                $q->whereHas('reports', function ($subQuery) {
                    $subQuery->where('id', '>', 0); // Report count > 0
                })
                ->orWhere('visibility', 'hidden');
            })
            ->firstOrFail();


        return inertia('Admin/Review/FreedomWall/Show', [
            'entry' => new FreedomWallResource($freedomWall),
        ]);
    }

    public function hideFreedomWall($id)
    {
        // dd($id);
        $freedomWall = FreedomWall::findOrFail($id);

        if(!$freedomWall){
            return back()->with('error', 'FreedomWall not found.');
        }

        $freedomWall->update(['archive_by' => Auth::user()->id ]);
        $freedomWall->update(['visibility' => 'hidden']);

        return to_route('admin-review-report-freedom-wall.index')->with(['success' => 'Archive successfully.']);
    }
    public function restoreFreedomWall($id)
    {
        $entry = FreedomWall::findOrFail($id);

        if(!$entry){
            return back()->with('error', 'FreedomWall not found.');
        }

        $entry->update(['archive_by' => null ]);
        $entry->update(['visibility' => 'visible']);

        return to_route('admin-review-report-freedom-wall.index')->with(['success' => 'Restore successfully.']);
    }

    public function rejectFreedomWallReport($id)
    {
        $entry = FreedomWall::findOrFail($id);

        if(!$entry){
            return back()->with('error', 'FreedomWall not found.');
        }

        $entry->update(['visibility' => 'visible']);
        $entry->update(['report_count' => 0]);

        //get the id of the freedom wall then delete all the report data
        $entry->reports()->delete();//trial

        return to_route('admin-review-report-freedom-wall.index')->with(['success' => 'Reject successfully.']);
    }

    public function destroyFreedomWall($id)
    {
        // dd($id);
        $entry = FreedomWall::findOrFail($id);

        if(!$entry){
            return back()->with('error', 'FreedomWall not found.');
        }

        $entry->delete();
        $entry->reports()->delete();//trial

        return to_route('admin-review-report-freedom-wall.index')->with(['success' => 'Delete successfully.']);
    }

     //=====================================Newsletter=========================================//

    public function newsletter()
    {   

        $query = Newsletter::query();

        $sortField = request('sort_field', 'id');
        $sortDirection = request('sort_direction', 'desc');
        
        // Apply search filters if present
        if (request('description')) {
            $query->where('description', 'like', '%' . request('description') . '%');
        }
        
        if (request('visibility')) {
            $query->where('visibility', request('visibility'));
        }

        // Ensure proper grouping with orWhere for visibility
        // $query->where(function($q) {
        //     $q->where('report_count', '>', 0)//report count is not implemented
        //         ->orWhere('visibility', 'hidden');
        // });  

        $query->where(function ($q) {
            $q->orWhere('visibility', 'hidden')
            ->where('archive_by', Auth::user()->id);
        });

        // Apply sorting
        $newsletters = $query->orderBy($sortField, $sortDirection)
            ->where('visibility', 'hidden')
            ->paginate(10)
            ->onEachSide(1);

        return inertia('Admin/Review/Newsletter/Index', [
            'newsletters' => NewsletterResource::collection($newsletters),
            'queryParams' => request()->query() ? : null,
        ]);
    }

    public function hideNewsletter($id)
    {
        // dd($id);
        $newsletter = Newsletter::findOrFail($id);

        if(!$newsletter){
            return back()->with('error', 'Newsletter not found.');
        }

        $newsletter->update(['archive_by' => Auth::user()->id ]);
        $newsletter->update(['visibility' => 'hidden']);
        

        return to_route('admin-review-report-newsletter.index')->with(['success' => 'Archive successfully.']);
    }
    public function restoreNewsletter($id)
    {
        // dd('dksa;l');
        $newsletter = Newsletter::findOrFail($id);

        if(!$newsletter){
            return back()->with('error', 'Newsletter not found.');
        }

        $newsletter->update(['archive_by' => null ]);
        $newsletter->update(['visibility' => 'visible']);

        return to_route('admin-review-report-newsletter.index')->with(['success' => 'Restore successfully.']);
    }

    public function rejectNewsletterReport($id)
    {
        $newsletter = Newsletter::findOrFail($id);

        if(!$newsletter){
            return back()->with('error', 'Newsletter not found.');
        }

        $newsletter->update(['visibility' => 'visible']);
        $newsletter->update(['report_count' => 0]);

        return to_route('admin-review-report-newsletter.index')->with(['success' => 'Reject successfully.']);
    }

    public function destroyNewsletter($id)
    {
        // dd($id);
        $newsletter = Newsletter::findOrFail($id);

        if(!$newsletter){
            return back()->with('error', 'Newsletter not found.');
        }

        $newsletter->delete();

        if ($newsletter->newsletter_thumbnail_image_path) {
            // Delete the specific old image file
            Storage::disk('public')->delete($newsletter->newsletter_thumbnail_image_path);
        }

        if ($newsletter->newsletter_file_path) {
            // Delete the specific old  file
            Storage::disk('public')->delete($newsletter->newsletter_file_path);
        }   
        return to_route('admin-review-report-newsletter.index')->with(['success' => 'Delete successfully.']);
    }

    //=====================================Task=========================================//

    public function task()
    {   

        $query = Task::query();

        $sortField = request('sort_field', 'id');
        $sortDirection = request('sort_direction', 'desc');
        
        // Apply search filters if present
        if (request('name')) {
            $query->where('name', 'like', '%' . request('name') . '%');
        }
        
        if (request('visibility')) {
            $query->where('visibility', request('visibility'));
        }

        // Apply sorting
        $tasks = $query->orderBy($sortField, $sortDirection)
            ->where('visibility', 'hidden')
            ->paginate(10)
            ->onEachSide(1);

        return inertia('Admin/Review/Task/Index', [
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ? : null,
        ]);
    }

    public function showTask($id)
    {
        $task = Task::findOrFail($id);

        return inertia('Admin/Review/Task/Show', [
            'task' => new TaskResource($task),
        ]);
    }

    public function hideTask($id)
    {
        // dd($id);
        $task = Task::findOrFail($id);

        if(!$task){
            return back()->with('error', 'Task not found.');
        }

        $task->update(['archive_by' => Auth::user()->id ]);
        $task->update(['visibility' => 'hidden']);

        return to_route('admin-archive-task.index')->with(['success' => 'Archive successfully.']);
    }
    public function restoreTask($id)
    {
        // dd('dksa;l');
        $task = Task::findOrFail($id);

        if(!$task){
            return back()->with('error', 'Task not found.');
        }

        $task->update(['archive_by' => null ]);
        $task->update(['visibility' => 'visible']);

        return to_route('admin-archive-task.index')->with(['success' => 'Restore successfully.']);
    }

    public function rejectTaskReport($id)
    {
        $task = Task::findOrFail($id);

        if(!$task){
            return back()->with('error', 'Task not found.');
        }

        $task->update(['visibility' => 'visible']);
        $task->update(['report_count' => 0]);

        return to_route('admin-archive-task.index')->with(['success' => 'Reject successfully.']);
    }

    public function destroyTask($id)
    {
        // dd($id);
        $task = Task::findOrFail($id);

        if(!$task){
            return back()->with('error', 'Task not found.');
        }

        $task->delete();
        
        if ($task->task_image_path) {
            // Delete the specific old  file
            Storage::disk('public')->delete($task->task_image_path);
        }   

        return to_route('admin-archive-task.index')->with(['success' => 'Delete successfully.']);
    }

}
