<?php

namespace App\Http\Controllers\Designer;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CommentResource;
use App\Http\Resources\FreedomWallResource;
use App\Http\Resources\NewsletterResource;
use App\Models\Article;
use App\Models\Comment;
use App\Models\FreedomWall;
use App\Models\Newsletter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


class DesignerReviewReport extends Controller
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
                ->orWhere('visibility', 'hidden');
        });

        // Apply sorting
        $reportedArticle = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia('Designer/Review/Article/Index', [
            'reportedArticle' => ArticleResource::collection($reportedArticle),
            'queryParams' => request()->query() ?: null,
        ]);
    }
    
    public function showArticle($id)
    {
        $article = Article::find($id);

        return inertia('Designer/Review/Article/Show', [
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

        return to_route('designer-review-report-article.index')->with(['success' => 'Hide Successfully']);
    }
    public function restoreArticle($id)
    {
        $article = Article::findOrFail($id);

        if(!$article){
            return back()->with('error', 'Article Not Found');
        }

        $article->update(['visibility' => 'visible']);

        return to_route('designer-review-report-article.index')->with(['success' => 'Restore Successfully']);
    }

    public function rejectArticleReport($id)
    {
        $article = Article::findOrFail($id);

        if(!$article){
            return back()->with('error', 'Article Not Found');
        }

        $article->update(['visibility' => 'visible']);
        $article->update(['report_count' => 0]);

        return to_route('designer-review-report-article.index')->with(['success' => 'Reject Successfully']);
    }

    public function destroyArticle($id)
    {
        $article = Article::findOrFail($id);

        if(!$article){
            return back()->with('error', 'Article Not Found');
        }

        $article->delete();

        if ($article->article_image_path) {
            // Delete the specific old image file
            Storage::disk('public')->delete($article->article_image_path);
        }

        return to_route('designer-review-report-article.index')->with(['success' => 'Delete Successfully']);
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
                ->orWhere('visibility', 'hidden');
        });

        // Apply sorting
        $reportedArticle = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia('Designer/Review/Comment/Index', [
            'reportedComments' => CommentResource::collection($reportedArticle),
            'queryParams' => request()->query() ? : null,
        ]);
    }

    public function showComment($comment_id, $article_id )
    {
        $comment = Comment::findOrFail($comment_id);
        $article = Article::findOrFail($article_id);

        return inertia('Designer/Review/Comment/Show', [
            'comment' => new CommentResource($comment),
            'article' => new ArticleResource($article),
        ]);
    }

    public function hideComment($id)
    {
        // dd($id);
        $comment = Comment::findOrFail($id);

        if(!$comment){
            return back()->with('error', 'Comment Not Found');
        }

        $comment->update(['visibility' => 'hidden']);

        return to_route('designer-review-report-comment.index')->with(['success' => 'Hide Successfully']);
    }
    public function restoreComment($id)
    {
        $comment = Comment::findOrFail($id);

        if(!$comment){
            return back()->with('error', 'Comment Not Found');
        }

        $comment->update(['visibility' => 'visible']);

        return to_route('designer-review-report-comment.index')->with(['success' => 'Restore Successfully']);
    }

    public function rejectCommentReport($id)
    {
        $comment = Comment::findOrFail($id);

        if(!$comment){
            return back()->with('error', 'Comment Not Found');
        }

        $comment->update(['visibility' => 'visible']);
        $comment->update(['report_count' => 0]);

        return to_route('designer-review-report-comment.index')->with(['success' => 'Reject Successfully']);
    }

    public function destroyComment($id)
    {
        // dd($id);
        $comment = Comment::findOrFail($id);

        if(!$comment){
            return back()->with('error', 'Comment Not Found');
        }

        $comment->delete();

        return to_route('designer-review-report-comment.index')->with(['success' => 'Delete Successfully']);
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

        // Ensure proper grouping with orWhere for visibility
        $query->where(function($q) {
            $q->where('report_count', '>', 0)
                ->orWhere('visibility', 'hidden');
        });

        // Apply sorting
        $reportedFreedomWall = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia('Designer/Review/FreedomWall/Index', [
            'reportedFreedomWall' => FreedomWallResource::collection($reportedFreedomWall),
            'queryParams' => request()->query() ? : null,
        ]);
    }

    public function showFreedomWall($id)
    {
        $entry = FreedomWall::findOrFail($id);

        return inertia('Designer/Review/FreedomWall/Show', [
            'entry' => new FreedomWallResource($entry),
        ]);
    }

    public function hideFreedomWall($id)
    {
        // dd($id);
        $freedomWall = FreedomWall::findOrFail($id);

        if(!$freedomWall){
            return back()->with('error', 'FreedomWall Not Found');
        }

        $freedomWall->update(['visibility' => 'hidden']);

        return to_route('designer-review-report-freedom-wall.index')->with(['success' => 'Hide Successfully']);
    }
    public function restoreFreedomWall($id)
    {
        $entry = FreedomWall::findOrFail($id);

        if(!$entry){
            return back()->with('error', 'FreedomWall Not Found');
        }

        $entry->update(['visibility' => 'visible']);

        return to_route('designer-review-report-freedom-wall.index')->with(['success' => 'Restore Successfully']);
    }

    public function rejectFreedomWallReport($id)
    {
        $entry = FreedomWall::findOrFail($id);

        if(!$entry){
            return back()->with('error', 'FreedomWall Not Found');
        }

        $entry->update(['visibility' => 'visible']);
        $entry->update(['report_count' => 0]);

        return to_route('designer-review-report-freedom-wall.index')->with(['success' => 'Reject Successfully']);
    }

    public function destroyFreedomWall($id)
    {
        // dd($id);
        $entry = FreedomWall::findOrFail($id);

        if(!$entry){
            return back()->with('error', 'FreedomWall Not Found');
        }

        $entry->delete();

        return to_route('designer-review-report-freedom-wall.index')->with(['success' => 'Delete Successfully']);
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

        // Apply sorting
        $newsletters = $query->orderBy($sortField, $sortDirection)
            ->where('visibility', 'hidden')
            ->paginate(10)
            ->onEachSide(1);

        return inertia('Designer/Review/Newsletter/Index', [
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

        $newsletter->update(['visibility' => 'hidden']);

        return to_route('designer-review-report-newsletter.index')->with(['success' => 'Archive successfully.']);
    }
    public function restoreNewsletter($id)
    {
        // dd('dksa;l');
        $newsletter = Newsletter::findOrFail($id);

        if(!$newsletter){
            return back()->with('error', 'Newsletter not found.');
        }

        $newsletter->update(['visibility' => 'visible']);

        return to_route('designer-review-report-newsletter.index')->with(['success' => 'Restore successfully.']);
    }

    public function rejectNewsletterReport($id)
    {
        $newsletter = Newsletter::findOrFail($id);

        if(!$newsletter){
            return back()->with('error', 'Newsletter not found.');
        }

        $newsletter->update(['visibility' => 'visible']);
        $newsletter->update(['report_count' => 0]);

        return to_route('designer-review-report-newsletter.index')->with(['success' => 'Reject successfully.']);
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
        return to_route('designer-review-report-newsletter.index')->with(['success' => 'Delete successfully.']);
    }


}
