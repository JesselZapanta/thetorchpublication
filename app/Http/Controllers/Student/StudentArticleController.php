<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\StudentStoreArticleRequest;
use App\Http\Resources\AcademicYearResource;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CategoryResource;
use App\Models\AcademicYear;
use App\Models\Article;
use App\Http\Requests\UpdateArticleRequest;
use App\Models\Category;
use App\Models\Word;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Utilities\AhoCorasick; // Import the AhoCorasick class

class StudentArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $articles = Article::all();
        $query = Article::query();
        $id =  Auth::user()->id;

        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');
        
        
        if(request('title')){
            $query->where('title', 'like', '%'. request('title') . '%');
        }
        
        if (request('category')) {
            // Join with the users table to search by name
            $query->whereHas('category', function ($q) {
                $q->where('name', 'like', '%' . request('category') . '%');
            });
        }

        if(request('status')){
            $query->where('status', request('status'));
        }

        $articles = $query->where('created_by', $id)->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        return inertia('Student/Article/Index', [
            'articles' => ArticleResource::collection($articles),
            'queryParams' => request()->query() ? : null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();

        return inertia('Student/Article/Create', [
            'categories' => CategoryResource::collection($categories),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StudentStoreArticleRequest $request)
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

        // Check if the article body contains any bad words using Aho-Corasick
        if ($ahoCorasick->search(strtolower($data['body']))) {
            return redirect()->back()->withErrors(['body' => 'The body contains inappropriate content.']);
        }

        // Check if the article body contains any bad words using Aho-Corasick
        if ($ahoCorasick->search(strtolower($data['caption']))) {
            return redirect()->back()->withErrors(['caption' => 'The caption contains inappropriate content.']);
        }

        $activeAy = AcademicYear::where('status', 'active')->first();

        if (!$activeAy) {
            $activeAy = AcademicYear::orderBy('created_at', 'desc')->first();
        }

        // 
        $image = $data['article_image_path'];
        $data['created_by'] = Auth::user()->id;
        $data['edited_by'] = Auth::user()->id;
        $data['layout_by'] = Auth::user()->id;
        //todo
        $data['academic_year_id'] = $activeAy->id;
        $data['published_date'] = now();

        $data['slug'] = Str::slug($request->title);

        if ($image) {
            // Store the image directly under the 'article/' directory and save its path
            $data['article_image_path'] = $image->store('article', 'public');
        }

        Article::create($data);

        return to_route('student-article.index')->with('success', 'Article submitted Successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Article $article)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Article $article)
    {
        // $activeAy = AcademicYear::where('status', 'active')->first();//for non admin
        $activeAy = AcademicYear::all();//for admin

        if (!$activeAy) {
            $activeAy = AcademicYear::orderBy('created_at', 'desc')->first();
        }

        $categories = Category::all();

        return inertia('Student/Article/Edit', [
            'article' => new ArticleResource($article),
            'categories' => CategoryResource::collection($categories),
            // 'activeAy' => new AcademicYearResource($activeAy),//for non admin
            'activeAy' => AcademicYearResource::collection($activeAy),//for admin
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateArticleRequest $request, Article $article)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article)
    {
        //
    }
}
