<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CategoryResource;
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
        // $articles = Article::all();
        $query = Article::query();

        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');
        
        
        if(request('title')){
            $query->where('title', 'like', '%'. request('title') . '%');
        }
        
        if (request('created_by')) {
            // Join with the users table to search by name
            $query->whereHas('createdBy', function ($q) {
                $q->where('name', 'like', '%' . request('created_by') . '%');
            });
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

        $articles = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        return inertia('Admin/Article/Index', [
            'articles' => ArticleResource::collection($articles),
            'queryParams' => request()->query() ? : null,
            'success' => session('success'),
            'delete_success' => session('delete_success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();
        return inertia('Admin/Article/Create', [
            'categories' => CategoryResource::collection($categories),
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

        if($image){
            $data['article_image_path'] = $image->store('article/' . Str::random(), 'public');
        }

        Article::create($data);

        return to_route('article.index')->with('success', 'Article submitted Successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Article $article)
    {
        return inertia('Admin/Article/Show', [
            'article' => new ArticleResource($article),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Article $article)
    {
        $categories = Category::all();

        return inertia('Admin/Article/Edit', [
            'article' => new ArticleResource($article),
            'categories' => CategoryResource::collection($categories),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateArticleRequest $request, Article $article)
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
        
        $image = $data['article_image_path'];
        $data['created_by'] = Auth::user()->id;
        $data['edited_by'] = Auth::user()->id;
        $data['layout_by'] = Auth::user()->id;

        if($image){
            // Delete the old  image if a new one is uploaded
            if($article->article_image_path){
                Storage::disk('public')->deleteDirectory(dirname($article->article_image_path));
            }
            // Store the new  image
            $data['article_image_path'] = $image->store('article/' . Str::random(), 'public');
        }else{
            // If no new image is uploaded, keep the existing image
            $data['article_image_path'] = $article->article_image_path;
        }
        
        $article->update($data);

        return to_route('article.index')->with('success', 'Article Updated Successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article)
    {
        $article->delete();

        if($article->article_image_path){
            Storage::disk('public')->deleteDirectory(dirname($article->article_image_path));
        }

        return to_route('article.index')->with('delete_success', 'Deleted Successfully');
    }
}
