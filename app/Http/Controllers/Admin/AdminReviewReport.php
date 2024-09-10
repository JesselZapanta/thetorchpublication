<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CommentResource;
use App\Http\Resources\FreedomWallResource;
use App\Models\Article;
use App\Models\Comment;
use App\Models\FreedomWall;
use Illuminate\Http\Request;

class AdminReviewReport extends Controller
{

    public function article()
    {   
        $query = Article::query();

        $sortField = request('sort_field', 'id');
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
                ->orWhere('visibility', 'hidden');
        });

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
        $article = Article::where('slug', $slug)->firstOrFail();

        return inertia('Admin/Review/Article/Show', [
            'article' => new ArticleResource($article),
        ]);
    }
    public function hideArticle($id)
    {
        $article = Article::findOrFail($id);

        if(!$article){
            return back()->with('error', 'Article Not Found');
        }

        $article->update(['visibility' => 'hidden']);

        return to_route('admin-review-report-article.index')->with(['success' => 'Hide Successfully']);
    }
    public function restoreArticle($id)
    {
        $article = Article::findOrFail($id);

        if(!$article){
            return back()->with('error', 'Article Not Found');
        }

        $article->update(['visibility' => 'vissible']);

        return to_route('admin-review-report-article.index')->with(['success' => 'Restore Successfully']);
    }

    public function rejectArticleReport($id)
    {
        $article = Article::findOrFail($id);

        if(!$article){
            return back()->with('error', 'Article Not Found');
        }

        $article->update(['visibility' => 'vissible']);
        $article->update(['report_count' => 0]);

        return to_route('admin-review-report-article.index')->with(['success' => 'Reject Successfully']);
    }




    // 
    public function comment()
    {   
        $reportedComments = Comment::where('report_count', '>', 0)
                            ->where('visibility', 'visible')
                            ->get();

        return inertia('Admin/Review/Comment/Index', [
            'reportedComments' => CommentResource::collection($reportedComments),
            'queryParams' => request()->query() ? : null,
        ]);
    }

    public function freedomWall()
    {   
        $reportedFreedomWall = FreedomWall::where('report_count', '>', 0)
        ->where('visibility', 'visible')
        ->get();


        return inertia('Admin/Review/FreedomWall/Index', [
            'reportedFreedomWall' => FreedomWallResource::collection($reportedFreedomWall),
            'queryParams' => request()->query() ? : null,
        ]);
    }
}
