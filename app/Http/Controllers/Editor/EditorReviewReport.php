<?php

namespace App\Http\Controllers\Editor;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CommentResource;
use App\Http\Resources\FreedomWallResource;
use App\Models\Article;
use App\Models\Comment;
use App\Models\FreedomWall;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;


class EditorReviewReport extends Controller
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

        return inertia('Editor/Review/Article/Index', [
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

        return inertia('Editor/Review/Article/Show', [
            'article' => new ArticleResource($article),
        ]);
    }
    public function hideArticle($id)
    {
        $article = Article::findOrFail($id);

        if(!$article){
            return back()->with('error', 'Article not found.');
        }

        $article->update(['archive_by' => Auth::user()->id ]);
        $article->update(['visibility' => 'hidden']);

        return to_route('editor-review-report-article.index')->with(['success' => 'Archive successfully.']);
    }
    public function restoreArticle($id)
    {
        $article = Article::findOrFail($id);

        if(!$article){
            return back()->with('error', 'Article not found.');
        }

        $article->update(['archive_by' => null ]);
        $article->update(['visibility' => 'visible']);

        return to_route('editor-review-report-article.index')->with(['success' => 'Restore successfully.']);
    }

    public function rejectArticleReport($id)
    {
        $article = Article::findOrFail($id);

        if(!$article){
            return back()->with('error', 'Article not found.');
        }

        $article->update(['visibility' => 'visible']);
        $article->update(['report_count' => 0]);

        return to_route('editor-review-report-article.index')->with(['success' => 'Reject successfully.']);
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

        return to_route('editor-review-report-article.index')->with(['success' => 'Delete successfully.']);
    }

    // Comment
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

        return inertia('Editor/Review/Comment/Index', [
            'reportedComments' => CommentResource::collection($reportedArticle),
            'queryParams' => request()->query() ? : null,
        ]);
    }

    public function showComment($comment_id)
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

        return inertia('Editor/Review/Comment/Show', [
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

        $comment->update(['archive_by' => Auth::user()->id ]);
        $comment->update(['visibility' => 'hidden']);

        return to_route('editor-review-report-comment.index')->with(['success' => 'Archive successfully.']);
    }
    public function restoreComment($id)
    {
        $comment = Comment::findOrFail($id);

        if(!$comment){
            return back()->with('error', 'Comment not found.');
        }

        $comment->update(['archive_by' => null ]);
        $comment->update(['visibility' => 'visible']);

        return to_route('editor-review-report-comment.index')->with(['success' => 'Restore successfully.']);
    }

    public function rejectCommentReport($id)
    {
        $comment = Comment::findOrFail($id);

        if(!$comment){
            return back()->with('error', 'Comment not found.');
        }

        $comment->update(['visibility' => 'visible']);
        $comment->update(['report_count' => 0]);

        return to_route('editor-review-report-comment.index')->with(['success' => 'Reject successfully.']);
    }

    public function destroyComment($id)
    {
        // dd($id);
        $comment = Comment::findOrFail($id);

        if(!$comment){
            return back()->with('error', 'Comment not found.');
        }

        $comment->delete();

        return to_route('editor-review-report-comment.index')->with(['success' => 'Delete successfully.']);
    }

    //Freedom Wall

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

        $query->where(function ($q) {
        $q->whereHas('reports', function ($subQuery) {
              $subQuery->where('id', '>', 0); // Report count > 0
            })
            ->orWhere('visibility', 'hidden');
        });

        //todo
        // $query->where(function ($q) {
        //     $q->whereHas('reports', function ($subQuery) {
        //         $subQuery->where('id', '>', 0); // Report count > 0
        //     })
        //     ->orWhere(function ($subQuery) {
        //         $subQuery->where('visibility', 'hidden')
        //                 ->where('archive_by', auth()->id()); // Ensure only the archiver can see hidden items the 
        //     });
        // });

        // Apply sorting
        $reportedFreedomWall = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia('Editor/Review/FreedomWall/Index', [
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

        return inertia('Editor/Review/FreedomWall/Show', [
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

        return to_route('editor-review-report-freedom-wall.index')->with(['success' => 'Archive successfully.']);
    }
    public function restoreFreedomWall($id)
    {
        $entry = FreedomWall::findOrFail($id);

        if(!$entry){
            return back()->with('error', 'FreedomWall not found.');
        }
        
        $entry->update(['archive_by' => null ]);
        $entry->update(['visibility' => 'visible']);

        return to_route('editor-review-report-freedom-wall.index')->with(['success' => 'Restore successfully.']);
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

        return to_route('editor-review-report-freedom-wall.index')->with(['success' => 'Reject successfully.']);
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

        return to_route('editor-review-report-freedom-wall.index')->with(['success' => 'Delete successfully.']);
    }

}
