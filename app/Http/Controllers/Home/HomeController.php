<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Http\Resources\AcademicYearResource;
use App\Http\Resources\HomeArticleResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\CommentResource;
use App\Http\Resources\HomeNewsletterResource;
use App\Http\Resources\MemberResource;
use App\Http\Resources\NewsletterResource;
use App\Models\AcademicYear;
use App\Models\Article;
use App\Models\Category;
use App\Models\Comment;
use App\Models\Member;
use App\Models\Newsletter;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        // Fetch active categories
        $categories = Category::where('status', 'active')->limit(5)->get();

       // Fetch the featured article
        $featuredArticle = Article::where('is_featured', 'yes')
                                // ->where('draft', 'no')
                                ->where('status', 'published')
                                ->where('visibility', 'visible')
                                ->whereHas('category', function ($query) {
                                    // Check that the associated category has an 'active' status
                                    $query->where('status', 'active');
                                })
                                ->first();

        // If there is no featured article, get the latest article
        if (!$featuredArticle) {
            $featuredArticle = Article::latest()
                ->where('status', 'published')
                // ->where('draft', 'no')
                ->where('visibility', 'visible')
                ->whereHas('category', function ($query) {
                                    // Check that the associated category has an 'active' status
                                    $query->where('status', 'active');
                                })
                ->first() ?? null;
        }


        // Get the top  articles with the most views
        $topArticles = Article::withCount('views') // Count the related views
                                ->where('status', 'published')
                                // ->where('draft', 'no') // Uncomment if needed
                                ->where('visibility', 'visible')
                                ->whereNot('is_featured', 'yes')
                                ->whereHas('category', function ($query) {
                                    // Check that the associated category has an 'active' status
                                    $query->where('status', 'active');
                                })
                                ->orderBy('views_count', 'DESC') // Order by the count of views
                                ->limit(2)
                                ->get();


        $latestArticles = Article::orderBy('published_date', 'DESC')
                                ->where('status', 'published')
                                ->where('visibility', 'visible')
                                ->whereNot('is_featured', 'yes')
                                ->whereHas('category', function ($query) {
                                    // Check that the associated category has an 'active' status
                                    $query->where('status', 'active');
                                })
                                ->limit(12)
                                ->get();

        $latestNewsletter = Newsletter::orderBy('distributed_at', 'DESC')
                                ->where('visibility', 'visible')
                                ->where('status', 'distributed')
                                ->limit(4)
                                ->get();

        return inertia('Welcome', [
            'categories' => CategoryResource::collection($categories),
            'featuredArticle' => $featuredArticle ? new HomeArticleResource($featuredArticle) : null,
            'topArticles' => HomeArticleResource::collection($topArticles),
            'latestArticles' => HomeArticleResource::collection($latestArticles),
            'latestNewsletter' => HomeNewsletterResource::collection($latestNewsletter),
        ]);
    }

    public function filterByCategory(Request $request, $slug)
    {
        // Fetch active categories
        $categories = Category::where('status', 'active')->limit(5)->get();

        $currentCategory = Category::where('slug', $slug)
                        ->where('status', 'active')
                        ->firstOrFail();

        // Fetch the current category details
        // $currentCategory = Category::findOrFail($id);


        if ($currentCategory->status !== 'active') {
            // If the category is not active, return a 404 response
            abort(404);
        }


        // Fetch articles by the selected category and filter by title if search query is provided
        $query = Article::where('category_id', $currentCategory->id)
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
                $query->withCount('views') 
                        ->orderBy('views_count', 'desc'); 
                break;
            case 'views_asc':
                $query->withCount('views') 
                        ->orderBy('views_count', 'asc'); 
                break;
            case 'ratings_desc':
                $query->withAvg('ratings as avg_rating', 'rating')
                    ->orderBy('avg_rating', 'desc');
                    break;
            case 'ratings_asc':
                $query->withAvg('ratings as avg_rating', 'rating')
                    ->orderBy('avg_rating', 'asc');
                    break;
            case '30_days_desc':
                $query->where('created_at', '>=', now('Asia/Manila')->subDays(30))
                        ->orderBy('created_at', 'desc');
                break;
            case '60_days_desc':
                $query->where('created_at', '>=', now('Asia/Manila')->subDays(30))
                        ->orderBy('created_at', 'desc');
                break;
            case '90_days_desc':
                $query->where('created_at', '>=', now('Asia/Manila')->subDays(30))
                        ->orderBy('created_at', 'desc');
                break;
        }

        //Apply search filter
        if($request->has('search') && !empty($request->search)){
            $query->where('title', 'like', "%{$request->search}%");
        }

        $categoryarticles = $query->paginate(15);//adjust if needed

        return inertia('ByCategory', [
            'categories' => CategoryResource::collection($categories),
            'categoryarticles' => HomeArticleResource::collection($categoryarticles),
            'currentCategory' => new CategoryResource($currentCategory),
        ]);
    }


    public function read($slug)
    {
        $article = Article::where('slug', $slug)
                            ->where('status', 'published')
                            ->where('visibility', 'visible')
                            ->firstOrFail();

        // dd($article);

        // check if the category on arti has a status active
        if ($article->category->status !== 'active') {
            abort(404);
        }

        // check if the arti status is !published
        if ($article->status !== 'published') {
            abort(404);
        }

        // Fetch active categories
        $categories = Category::where('status', 'active')->limit(5)->get();

        // Fetch the latest 5 comments for the article
        $comments = Comment::where('article_id', $article->id)
            // ->where('draft', 'no')
            ->where('visibility', 'visible')
            ->latest()
            ->get();

        $recommendedArticles = Article::where('id', '!=', $article->id) // Exclude current article
            ->where('visibility', 'visible') // Ensure visibility is 'visible'
            ->where('status', 'published') // Ensure status is 'published'
            ->whereHas('category', function ($query) {
                // Check that the associated category has an 'active' status
                $query->where('status', 'active');
            })
            ->whereRaw("MATCH(title, body) AGAINST(? IN BOOLEAN MODE)", [preg_replace('/[^\w\s]/', '', $article->title)]) // Sanitize title
            ->limit(5) // Limit results to 5
            ->get(); // Execute the query


        return inertia('ReadArticle', [
            'article' => new HomeArticleResource($article),
            'recommendedArticles' => HomeArticleResource::collection($recommendedArticles),
            'categories' => CategoryResource::collection($categories),
            'comments' => CommentResource::collection($comments),
        ]);
    }

    public function about()
    {
        $categories = Category::where('status', 'active')->limit(5)->get();

        //admin

        $admins = Member::where('role', 'admin')
                        ->where('status', 'active')
                        ->orderBy('id', 'asc')
                        ->get();

        //members 

        $members = Member::whereIn('role', ['editor', 'writer', 'designer'])
                    ->where('status', 'active')
                    ->orderBy('id', 'asc')
                        ->get();

        $activeAy = AcademicYear::where('status', 'active')->first();

        if (!$activeAy) {
            $activeAy = AcademicYear::orderBy('created_at', 'desc')->first() ?? null;
        }

        return inertia('About', [
            'categories' => CategoryResource::collection($categories),
            'admins' => MemberResource::collection($admins),
            'members' => MemberResource::collection($members),
            'activeAy' => $activeAy ? new AcademicYearResource($activeAy) : null,

        ]);
    }

    public function newsletter(Request $request)
    {
        $categories = Category::where('status', 'active')->limit(5)->get();

        $query = Newsletter::where('status', 'distributed')
                                ->where('visibility', 'visible');

        $sort = $request->input('sort', 'date_desc');

        switch($sort){
            case 'date_desc':
                $query->orderBy('created_at', 'desc');
                break;
            case 'date_asc':
                $query->orderBy('created_at', 'asc');
                break;
        }

        //Apply search filter
        if($request->has('search') && !empty($request->search)){
            $query->where('description', 'like', "%{$request->search}%");
        }

        $newsletters = $query->paginate(15);//adjust if needed

        return inertia('Newsletter', [
            'categories' =>  CategoryResource::collection($categories),
            'newsletters' =>  NewsletterResource::collection($newsletters),
        ]);
    }
}


