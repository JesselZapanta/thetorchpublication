<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AcademicYearResource;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CategoryResource;
use App\Models\AcademicYear;
use App\Models\Article;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Models\Category;
use App\Models\Word;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Utilities\AhoCorasick; // Import the AhoCorasick class


class AdminArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $admin_articles = Article::all();
        $query = Article::query();
        $id = Auth::user()->id;
        $categories = Category::all();
        $academicYears = AcademicYear::all();

        $sortField = request('sort_field', 'id');
        $sortDirection = request('sort_direction', 'desc');
        
        
        if(request('title')){
            $query->where('title', 'like', '%'. request('title') . '%');
        }

        //category
        if (request('category')) {
            // Join with the users table to search by name
            $query->whereHas('category', function ($q) {
                $q->where('name', 'like', '%' . request('category') . '%');
            });
        }

        // academic_year_id sort
        if (request('academic_year_id')) {
            // Join with the academicYear table to search by name
            $query->whereHas('academicYear', function ($q) {
                $q->where('code', 'like', '%' . request('academic_year_id') . '%');
            });
        }

        if(request('status')){
            $query->where('status', request('status'));
        }

        // Filter based on "My Articles" selection 
        switch (request('myArticle')) {
            case 'myArticle':
                // Show only articles created by the authenticated user
                $query->where('created_by', $id);
                break;

            default:
                // Show all articles created by the authenticated user and pending/rejected articles from others
                $query->where(function ($query) use ($id) {
                    $query->where('created_by', $id) // Auth user's articles
                            ->orWhere(function ($query) use ($id) {
                                $query->where('created_by', '!=', $id)
                                        ->whereIn('status', ['edited', 'published']); 
                            });
                    });
                break;
        }
        

        $admin_articles = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        return inertia('Admin/Article/Index', [
            'articles' => ArticleResource::collection($admin_articles),
            'categories' => CategoryResource::collection($categories),
            'academicYears' => AcademicYearResource::collection($academicYears),
            'queryParams' => request()->query() ? : null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // $activeAy = AcademicYear::where('status', 'active')->first();//for non admin
        $activeAy = AcademicYear::all();//for admin

        if (!$activeAy) {
            $activeAy = AcademicYear::orderBy('created_at', 'desc')->first();
        }

        $categories = Category::all();

        return inertia('Admin/Article/Create', [
            'categories' => CategoryResource::collection($categories),
            // 'activeAy' => new AcademicYearResource($activeAy),//for non admin
            'activeAy' => AcademicYearResource::collection($activeAy),//for admin
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreArticleRequest $request)
    {
        $data = $request->validated();

        // Build the Trie
        $badWords = Word::pluck('name')->toArray();//todo might change to word insted of name
        $ahoCorasick = new AhoCorasick();
        foreach ($badWords as $badWord) {
            $ahoCorasick->insert(strtolower($badWord));
        }
        $ahoCorasick->buildFailureLinks();

        // Check if the article title contains any bad words using Aho-Corasick
        if ($ahoCorasick->search(strtolower($data['title']))) {
            return redirect()->back()->withErrors(['title' => 'The title contains inappropriate content.']);
        }

        // Check if the article excerpt contains any bad words using Aho-Corasick
        if ($ahoCorasick->search(strtolower($data['excerpt']))) {
            return redirect()->back()->withErrors(['excerpt' => 'The excerpt contains inappropriate content.']);
        }

        // Check if the article body contains any bad words using Aho-Corasick
        if ($ahoCorasick->search(strtolower($data['body']))) {
            return redirect()->back()->withErrors(['body' => 'The body contains inappropriate content.']);
        }

        // Check if the article body contains any bad words using Aho-Corasick
        if ($ahoCorasick->search(strtolower($data['caption']))) {
            return redirect()->back()->withErrors(['caption' => 'The caption contains inappropriate content.']);
        }


        // 
        $image = $data['article_image_path'];
        $data['created_by'] = Auth::user()->id;
        $data['edited_by'] = Auth::user()->id;
        $data['layout_by'] = Auth::user()->id;

        $data['slug'] = Str::slug($request->title);

        //  'slug' => Str::slug($req->title),

        if ($image) {
            // Store the image directly under the 'article/' directory and save its path
            $data['article_image_path'] = $image->store('article', 'public');
        }

        if($data['is_featured'] === "yes") {
            // Set all existing is_featured status to 'no'
            Article::query()->update(['is_featured' => "no"]);
        }



        Article::create($data);

        return to_route('admin-article.index')->with(['success' => 'Article Created Successfully']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Article $admin_article)
    {
        return inertia('Admin/Article/Show', [
            'article' => new ArticleResource($admin_article),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Article $admin_article)
    {
        // $activeAy = AcademicYear::where('status', 'active')->first();//for non admin
        $activeAy = AcademicYear::all();//for admin

        if (!$activeAy) {
            $activeAy = AcademicYear::orderBy('created_at', 'desc')->first();
        }

        $categories = Category::all();

        return inertia('Admin/Article/Edit', [
            'article' => new ArticleResource($admin_article),
            'categories' => CategoryResource::collection($categories),
            // 'activeAy' => new AcademicYearResource($activeAy),//for non admin
            'activeAy' => AcademicYearResource::collection($activeAy),//for admin
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateArticleRequest $request, Article $admin_article)
    {
        $data = $request->validated();

        // Build the Trie
        $badWords = Word::pluck('name')->toArray();//todo might change to word insted of name
        $ahoCorasick = new AhoCorasick();
        foreach ($badWords as $badWord) {
            $ahoCorasick->insert(strtolower($badWord));
        }
        $ahoCorasick->buildFailureLinks();

        // Check if the article title contains any bad words using Aho-Corasick
        if ($ahoCorasick->search(strtolower($data['title']))) {
            return redirect()->back()->withErrors(['title' => 'The title contains inappropriate content.']);
        }

        // Check if the article excerpt contains any bad words using Aho-Corasick
        if ($ahoCorasick->search(strtolower($data['excerpt']))) {
            return redirect()->back()->withErrors(['excerpt' => 'The excerpt contains inappropriate content.']);
        }

        // Check if the article body contains any bad words using Aho-Corasick
        if ($ahoCorasick->search(strtolower($data['body']))) {
            return redirect()->back()->withErrors(['body' => 'The body contains inappropriate content.']);
        }

        // Check if the article caption contains any bad words using Aho-Corasick
        if ($ahoCorasick->search(strtolower($data['caption']))) {
            return redirect()->back()->withErrors(['caption' => 'The caption contains inappropriate content.']);
        }
        
        $image = $data['article_image_path'];
        $data['slug'] = Str::slug($request->title);

        //the revision or reject message message 
        $data['revision_message'] = $request->input('revision_message');
        
        $status = $data['status'];
        
        if($status == 'published'){
            $data['revision_message'] = null;
            $data['rejection_message'] = null;
        }

        if($status !== 'published'){
            $data['published_date'] = null;
        }

        if ($image) {
            // Delete the old image file if a new one is uploaded
            if ($admin_article->article_image_path) {
                Storage::disk('public')->delete($admin_article->article_image_path);
            }
            // Store the new image directly under the 'article/' directory
            $data['article_image_path'] = $image->store('article', 'public');

            $data['layout_by'] = Auth::user()->id;  
        } else {
            // If no new image is uploaded, keep the existing image
            $data['article_image_path'] = $admin_article->article_image_path;
        }

        if($data['is_featured'] === "yes") {
            // Set all existing is_featured status to 'no'
            Article::query()->update(['is_featured' => "no"]);
        }

        // Update the specific article with the provided data
        $admin_article->update($data);


        return to_route('admin-article.index')->with([ 'success' => 'Article Updated Successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $admin_article)
    {
        // dd($admin_article);
        $admin_article->delete();

        if ($admin_article->article_image_path) {
            // Delete the specific old image file
            Storage::disk('public')->delete($admin_article->article_image_path);
        }
        return to_route('admin-article.index')->with(['success' => 'Deleted Successfully']);
    }
}
