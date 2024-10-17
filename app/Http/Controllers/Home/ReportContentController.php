<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Comment;
use App\Models\FreedomWall;
use App\Models\ReportedFreedomWall;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportContentController extends Controller
{

    public function reportFreedomWall($id)
    {
        $freedomwall = FreedomWall::findOrFail($id);
        $freedomwall->increment('report_count');
        $userId = Auth::user()->id;

        ReportedFreedomWall::create([
                'user_id' => $userId,
                'freedom_wall_id' => $freedomwall->id,
                // 'reason' 
            ]);

        // return to_route('freedom-wall.index')->with('success', 'Content Reported Successfully');
        return redirect()->back()->with('success', 'Content Reported Successfully');
    }
    public function reportComment($id)
    {
        $comment = Comment::findOrFail($id);
        $comment->increment('report_count');

        
        return redirect()->back()->with('success', 'Content Reported Successfully');
        // return to_route('article.read', $comment->article_id)->with('success', 'Content Reported Successfully');
    }

    public function reportArticle($id)
    {
        $article = Article::findOrFail($id);
        $article->increment('report_count');

        // return response()->json(['success' => 'Content Reported Successfully']);
        return redirect()->back()->with('success', 'Content Reported Successfully');
    }
}
