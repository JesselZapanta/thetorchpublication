<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\ArticleView;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ArticleViewsController extends Controller
{
    public function incrementViews(Request $request, $articleId)
    {
        $user = Auth::user();

        $activeAy = AcademicYear::where('status', 'active')->first();

        if (!$activeAy) {
            $activeAy = AcademicYear::orderBy('created_at', 'desc')->first();
        }

        // Ensure no duplicate views are created
        // $existingView = ArticleView::where('article_id', $articleId)
        //     ->where('user_id', $user->id)
        //     ->where('academic_year_id', $academicYear->id)
        //     ->first();

        // if (!$existingView) {
        //     ArticleView::create([
        //         'article_id' => $articleId,
        //         'user_id' => $user->id,
        //         'academic_year_id' => $academicYear->id,
        //     ]);
        // }

        ArticleView::create([
            'article_id' => $articleId,
            'user_id' => $user->id,
            'academic_year_id' => $activeAy->id,
        ]);

        return redirect()->route('article.read', $articleId);
    }
}
