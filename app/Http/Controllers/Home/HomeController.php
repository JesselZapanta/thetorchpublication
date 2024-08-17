<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CategoryResource;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        // Fetch active categories
        $categories = Category::where('status', 'active')->limit(10)->get();
        $articles = Article::all();

        return inertia('Welcome', [
            'categories' => CategoryResource::collection($categories),
            // 'articles' => ArticleResource::collection($articles),
        ]);
    }

    public function filterByCategory($id)
    {
        // Fetch active categories
        $categories = Category::where('status', 'active')->limit(10)->get();

        // Fetch the current category details
        $currentCategory = Category::findOrFail($id);

        // Fetch articles by the selected category
        $categoryarticles = Article::where('category_id', $id)->get();

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
        return inertia('ReadArticle', [
            'article' => new ArticleResource($article),
            'categories' => CategoryResource::collection($categories),
        ]);
    }

}


