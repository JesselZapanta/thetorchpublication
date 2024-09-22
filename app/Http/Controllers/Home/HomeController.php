<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\CommentResource;
use App\Http\Resources\NewsletterResource;
use App\Models\Article;
use App\Models\Category;
use App\Models\Comment;
use App\Models\Newsletter;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        // Fetch active categories
        $categories = Category::where('status', 'active')->limit(10)->get();

       // Fetch the featured article
        $featuredArticle = Article::where('is_featured', 'yes')
                                // ->where('draft', 'no')
                                ->where('status', 'published')
                                ->where('visibility', 'visible')
                                ->first();

        // If there is no featured article, get the latest article
        if (!$featuredArticle) {
            $featuredArticle = Article::latest()
                                ->where('status', 'published')
                                // ->where('draft', 'no')
                                ->where('visibility', 'visible')
                                ->first();
        }

        // Get the top  articles with the most views
        $topArticles = Article::orderBy('views', 'DESC')
                                ->where('status', 'published')
                                // ->where('draft', 'no')
                                ->where('visibility', 'visible')
                                ->whereNot('is_featured', 'yes')
                                ->limit(2)
                                ->get();
        //todo might include the ratings and the comments

        $latestArticles = Article::orderBy('created_at', 'DESC')
                                ->where('status', 'published')
                                // ->where('draft', 'no')
                                ->where('visibility', 'visible')
                                ->whereNot('is_featured', 'yes')
                                ->limit(12)
                                ->get();

        $latestNewsletter = Newsletter::orderBy('created_at', 'DESC')
                                ->where('status', 'distributed')
                                ->limit(4)
                                ->get();

        return inertia('Welcome', [
            'categories' => CategoryResource::collection($categories),
            'featuredArticle' => new ArticleResource($featuredArticle),
            'topArticles' => ArticleResource::collection($topArticles),
            'latestArticles' => ArticleResource::collection($latestArticles),
            'latestNewsletter' => NewsletterResource::collection($latestNewsletter),
        ]);
    }

    public function filterByCategory(Request $request, $id)
    {
        // Fetch active categories
        $categories = Category::where('status', 'active')->limit(10)->get();

        // Fetch the current category details
        $currentCategory = Category::findOrFail($id);

        // Fetch articles by the selected category and filter by title if search query is provided
        $query = Article::where('category_id', $id)
                            // ->where('draft', 'no')
                            ->where('status', 'published')
                            ->where('visibility', 'visible');

         // Apply default sorting by date descending
        $sort = $request->input('sort', 'date_desc');

        switch($sort){
            case 'date_desc':
                $query->orderBy('created_at', 'desc');
                break;
            case 'date_asc':
                $query->orderBy('created_at', 'asc');
                break;
            case 'title_desc':
                $query->orderBy('title', 'desc');
                break;
            case 'title_asc':
                $query->orderBy('title', 'asc');
                break;
            case 'views_desc':
                $query->orderBy('views', 'desc');
                break;
            case 'views_asc':
                $query->orderBy('views', 'asc');
                break;
            case 'ratings_desc':
                $query->withCount(['ratings as avg_ratings'])
                    ->orderBy('avg_ratings', 'desc');
                    break;
            case 'ratings_asc':
                $query->withCount(['ratings as avg_ratings'])
                    ->orderBy('avg_ratings', 'asc');
                    break;
            case '30_days_desc':
                $query->where('created_at', '>=', now()->subDays(30))
                        ->orderBy('created_at', 'desc');
                break;
            case '60_days_desc':
                $query->where('created_at', '>=', now()->subDays(30))
                        ->orderBy('created_at', 'desc');
                break;
            case '90_days_desc':
                $query->where('created_at', '>=', now()->subDays(30))
                        ->orderBy('created_at', 'desc');
                break;
        }

        //Apply search filter
        if($request->has('search') && !empty($request->search)){
            $query->where('title', 'like', "%{$request->search}%");
        }

        $categoryarticles = $query->paginate(15);

        return inertia('ByCategory', [
            'categories' => CategoryResource::collection($categories),
            'categoryarticles' => ArticleResource::collection($categoryarticles),
            'currentCategory' => new CategoryResource($currentCategory),
        ]);
    }


    public function read(Article $article)
    {
        // Fetch active categories
        $categories = Category::where('status', 'active')->limit(10)->get();

        // Fetch the latest 5 comments for the article
        $comments = Comment::where('article_id', $article->id)
            // ->where('draft', 'no')
            ->where('visibility', 'visible')
            ->latest()
            ->get();

        return inertia('ReadArticle', [
            'article' => new ArticleResource($article),
            'categories' => CategoryResource::collection($categories),
            'comments' => CommentResource::collection($comments),
        ]);
    }

    public function incrementViews($articleId)
    {
        $article = Article::findOrFail($articleId);
        $article->increment('views');

        return redirect()->route('article.read', $articleId);
    }
}


