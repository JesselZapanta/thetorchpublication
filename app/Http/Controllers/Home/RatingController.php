<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Rating;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    public function rateArticle(Request $request)
    {
        $request->validate([
            'article_id' => 'required|exists:articles,id',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $activeAy = AcademicYear::where('status', 'active')->first();

        if (!$activeAy) {
            $activeAy = AcademicYear::orderBy('created_at', 'desc')->first();
        }

        // $data['academic_year_id'] = $activeAy->id;

        // Check if the user has already rated the article
        $rating = Rating::where('user_id', auth()->id())
            ->where('article_id', $request->article_id)
            ->first();

        if ($rating) {
            // Update the existing rating
            $rating->update([
                'rating' => $request->rating,
            ]);
        } else {
            // Create a new rating
            Rating::create([
                'article_id' => $request->article_id,
                'academic_year_id' => $activeAy->id,
                'user_id' => auth()->id(),
                'rating' => $request->rating,
            ]);
        }

        return response()->json(['success' => true, 'message' => 'Rating saved successfully!']);
    }


    public function getArticleRatings($articleId)
    {
        $userId = auth()->id();
        $averageRating = Rating::where('article_id', $articleId)->avg('rating');
        $userRating = Rating::where('article_id', $articleId)->where('user_id', $userId)->value('rating');
        $totalRatings = Rating::where('article_id', $articleId)->count();

        $averageRating = round($averageRating ?? 0, 1); // Default to 0 if null

        return response()->json([
            'userRating' => $userRating ?: 'None', // Return 'None' if no rating
            'avgRating' => $averageRating,
            'totalRatings' => $totalRatings,
        ]);
    }

}
