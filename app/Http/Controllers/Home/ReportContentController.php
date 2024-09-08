<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Comment;
use App\Models\FreedomWall;
use Illuminate\Http\Request;

class ReportContentController extends Controller
{

    public function reportFreedomWall($id)
    {
        $freedomwall = FreedomWall::findOrFail($id);
        $freedomwall->increment('report_count');

        // return to_route('freedom-wall.index')->with('success', 'Content Reported Successfully');
        return redirect()->back()->with('success', 'Content Reported Successfully');
    }
    public function reportComment($id)
    {
        $comment = Comment::findOrFail($id);
        $comment->increment('report_count');

        return response()->json(['success' => 'Content Reported Successfully']);
    }

    public function reportArticle($id)
    {
        $article = Article::findOrFail($id);
        $article->increment('report_count');

        return response()->json(['success' => 'Content Reported Successfully']);
    }
}
