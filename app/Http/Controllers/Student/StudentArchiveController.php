<?php

namespace App\Http\Controllers\Student;

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

class StudentArchiveController extends Controller
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
        // $query->where(function($q) {
        //     $q->where('report_count', '<', 0)
        //         ->orWhere(function($subQuery) {
        //             $subQuery->where('visibility', 'hidden')
        //                     ->where('archive_by', auth()->id()); // Ensure only the archiver can see hidden items
        //         });
        // });

        $query->where('visibility', 'hidden')->where('created_by', Auth::user()->id);


        // Apply sorting
        $archivedArticle = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia('Student/Archive/Article/Index', [
            'archivedArticle' => ArticleResource::collection($archivedArticle),
            'queryParams' => request()->query() ?: null,
        ]);
    }
    
    public function showArticle($slug)
    {
        $article = Article::where('slug', $slug)
                    ->where('created_by', Auth::user()->id)
                    ->where('visibility', 'hidden')
                    ->firstOrFail();

        return inertia('Student/Archive/Article/Show', [
            'article' => new ArticleResource($article),
        ]);
    }

    public function restoreArticle($id)
    {
        $article = Article::findOrFail($id);


        // dd($article);

        if($article->archive_by !== Auth::user()->id){
            return to_route('student-archive-article.index')->with(key: ['error' => 'Unable to restore the content. This content was archived by an administrator.']);
        }

        if(!$article){
            return back()->with('error', 'Article not found.');
        }

        $article->update(['archive_by' => null ]);
        $article->update(['visibility' => 'visible']);

        return to_route('student-archive-article.index')->with(['success' => 'Restore successfully.']);
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

        return to_route('student-archive-article.index')->with(['success' => 'Delete successfully.']);
    }


    // ============================== comment =================================

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
        //         ->orWhere(function($subQuery) {
        //             $subQuery->where('visibility', 'hidden')
        //                     ->where('archive_by', auth()->id()); // Ensure only the archiver can see hidden items
        //         });
        // });

        $query->where('visibility', 'hidden')->where('user_id', Auth::user()->id);

        // Apply sorting
        $archiveComments = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia('Student/Archive/Comment/Index', [
            'archiveComments' => CommentResource::collection($archiveComments),
            'queryParams' => request()->query() ? : null,
        ]);
    }

    public function showComment($comment_id )
    {

        $comment = Comment::where('visibility', 'hidden')
                    ->where('user_id', Auth::user()->id)
                    ->findOrFail($comment_id);

        return inertia('Student/Archive/Comment/Show', [
            'comment' => new CommentResource($comment)
        ]);
    }


    public function restoreComment($id)
    {
        $comment = Comment::findOrFail($id);

        // dd($comment);

        if(!$comment){
            return back()->with('error', 'Comment not found.');
        }

        if($comment->archive_by !== Auth::user()->id){
            return to_route('student-archive-comment.index')->with(key: ['error' => 'Unable to restore the content. This content was archived by an administrator.']);
        }

        $comment->update(['archive_by' => null ]);
        $comment->update(['visibility' => 'visible']);

        return to_route('student-archive-comment.index')->with(['success' => 'Restore successfully.']);
    }


    public function destroyComment($id)
    {
        // dd($id);
        $comment = Comment::findOrFail($id);

        if(!$comment){
            return back()->with('error', 'Comment not found.');
        }

        $comment->delete();

        return to_route('student-archive-comment.index')->with(['success' => 'Delete successfully.']);
    }


    // ==========================freedom wall====================
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

        $query->where(function ($q) {
            $q->orWhere('visibility', 'hidden')
            ->where('user_id', Auth::user()->id);
        });


        // Apply sorting
        $reportedFreedomWall = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia('Student/Archive/FreedomWall/Index', [
            'reportedFreedomWall' => FreedomWallResource::collection($reportedFreedomWall),
            'queryParams' => request()->query() ? : null,
        ]);
    }

    public function showFreedomWall($id)
    {

        $entry = FreedomWall::where('visibility', 'hidden')
                    ->where('user_id', Auth::user()->id)
                    ->findOrFail($id);

        return inertia('Student/Archive/FreedomWall/Show', [
            'entry' => new FreedomWallResource($entry),
        ]);
    }

    public function restoreFreedomWall($id)
    {
        $entry = FreedomWall::findOrFail($id);
        // dd($entry);
        if(!$entry){
            return back()->with('error', 'FreedomWall not found.');
        }

        if($entry->archive_by !== Auth::user()->id){
            return to_route('student-archive-freedom-wall.index')->with(key: ['error' => 'Unable to restore the content. This content was archived by an administrator.']);
        }
        
        $entry->update(['archive_by' => null ]);
        $entry->update(['visibility' => 'visible']);

        return to_route('student-archive-freedom-wall.index')->with(['success' => 'Restore successfully.']);
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

        return to_route('student-archive-freedom-wall.index')->with(['success' => 'Delete successfully.']);
    }
}
