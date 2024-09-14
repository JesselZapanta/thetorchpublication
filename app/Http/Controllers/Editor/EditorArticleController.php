<?php

namespace App\Http\Controllers\Editor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Editor\EditorStoreArticleRequest;
use App\Http\Requests\Editor\EditorUpdateArticleRequest;
use App\Http\Resources\AcademicYearResource;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CategoryResource;
use App\Models\AcademicYear;
use App\Models\Article;
use App\Models\Category;
use App\Models\Word;
use App\Utilities\AhoCorasick;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class EditorArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Article::query();
        $id = Auth::user()->id;

        $sortField = request('sort_field', 'id');
        $sortDirection = request('sort_direction', 'desc');

        // Check if filtering by title
        if (request('title')) {
            $query->where('title', 'like', '%'. request('title') . '%');
        }

        // Check if filtering by category
        if (request('category')) {
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

        // Check if filtering by status
        if (request('status')) {
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
                                        ->whereIn('status', ['pending', 'revision']); 
                            });
                    });
                break;
        }
        // Sorting the results
        $articles = $query->orderBy($sortField, $sortDirection)
                            ->paginate(10)
                            ->onEachSide(1);

        $categories = Category::all();
        $academicYears = AcademicYear::all();

        return inertia('Editor/Article/Index', [
            'articles' => ArticleResource::collection($articles),
            'categories' => CategoryResource::collection($categories),
            'academicYears' => AcademicYearResource::collection($academicYears),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();

        return inertia('Editor/Article/Create', [
            'categories' => CategoryResource::collection($categories),
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(EditorStoreArticleRequest $request)
    {
        $data = $request->validated();

        // Build the Trie with bad words
        $badWords = Word::pluck('name')->toArray(); // Adjust if column name changes
        $ahoCorasick = new AhoCorasick();
        foreach ($badWords as $badWord) {
            $ahoCorasick->insert(strtolower($badWord));
        }
        $ahoCorasick->buildFailureLinks();

        // Initialize an array to collect errors
        $errors = [];

        // Check if the article title contains any bad words
        $detectedWords = $ahoCorasick->search(strtolower($data['title']));
        if (!empty($detectedWords)) {
            $errors['title'] = 'The title contains inappropriate content: ' . implode(', ', $detectedWords);
        }

        // Check if the article excerpt contains any bad words
        $detectedWords = $ahoCorasick->search(strtolower($data['excerpt']));
        if (!empty($detectedWords)) {
            $errors['excerpt'] = 'The excerpt contains inappropriate content: ' . implode(', ', $detectedWords);
        }

        // Check if the article body contains any bad words
        $detectedWords = $ahoCorasick->search(strtolower($data['body']));
        if (!empty($detectedWords)) {
            $errors['body'] = 'The body contains inappropriate content: ' . implode(', ', $detectedWords);
        }

        // Check if the article caption contains any bad words
        $detectedWords = $ahoCorasick->search(strtolower($data['caption']));
        if (!empty($detectedWords)) {
            $errors['caption'] = 'The caption contains inappropriate content: ' . implode(', ', $detectedWords);
        }

        // If there are any errors, return them
        if (!empty($errors)) {
            return redirect()->back()->withErrors($errors);
        }

        $activeAy = AcademicYear::where('status', 'active')->first();

        if (!$activeAy) {
            $activeAy = AcademicYear::orderBy('created_at', 'desc')->first();
        }

        // 
        $image = $data['article_image_path'];
        $data['created_by'] = Auth::user()->id;
        $data['edited_by'] = Auth::user()->id;
        $data['academic_year_id'] = $activeAy->id;
        $data['status'] = 'edited';

        $data['slug'] = Str::slug($request->title);

        if ($image) {
            // Store the image directly under the 'article/' directory and save its path
            $data['article_image_path'] = $image->store('article', 'public');
            $data['layout_by'] = Auth::user()->id;
        }

        Article::create($data);

        return to_route('editor-article.index')->with(['success'=> 'Article submitted Successfully']);
    }

    /**
     * Display the specified resource.
     */
    // HOW TO IMPLEMENT A SLUG
    // public function show($editor_article)
    // {
    //     // Manually fetch the article by slug
    //     $article = Article::where('slug', $editor_article)->firstOrFail();

    //     return inertia('Editor/Article/Show', [
    //         'article' => new ArticleResource($article),
    //     ]);
    // }

    public function show(Article $editor_article)
    {
        return inertia('Editor/Article/Show', [
            'article' => new ArticleResource($editor_article),
        ]);
    }
    


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Article $editor_article)
    {
        $categories = Category::all();

        return inertia('Editor/Article/Edit', [
            'article' => new ArticleResource($editor_article),
            'categories' => CategoryResource::collection($categories),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EditorUpdateArticleRequest $request, Article $editor_article)
    {
        $data = $request->validated();
        
        // Build the Trie with bad words
        $badWords = Word::pluck('name')->toArray(); // Adjust if column name changes
        $ahoCorasick = new AhoCorasick();
        foreach ($badWords as $badWord) {
            $ahoCorasick->insert(strtolower($badWord));
        }
        $ahoCorasick->buildFailureLinks();

        // Initialize an array to collect errors
        $errors = [];

        // Check if the article title contains any bad words
        $detectedWords = $ahoCorasick->search(strtolower($data['title']));
        if (!empty($detectedWords)) {
            $errors['title'] = 'The title contains inappropriate content: ' . implode(', ', $detectedWords);
        }

        // Check if the article excerpt contains any bad words
        $detectedWords = $ahoCorasick->search(strtolower($data['excerpt']));
        if (!empty($detectedWords)) {
            $errors['excerpt'] = 'The excerpt contains inappropriate content: ' . implode(', ', $detectedWords);
        }

        // Check if the article body contains any bad words
        $detectedWords = $ahoCorasick->search(strtolower($data['body']));
        if (!empty($detectedWords)) {
            $errors['body'] = 'The body contains inappropriate content: ' . implode(', ', $detectedWords);
        }

        // Check if the article caption contains any bad words
        $detectedWords = $ahoCorasick->search(strtolower($data['caption']));
        if (!empty($detectedWords)) {
            $errors['caption'] = 'The caption contains inappropriate content: ' . implode(', ', $detectedWords);
        }

        // If there are any errors, return them
        if (!empty($errors)) {
            return redirect()->back()->withErrors($errors);
        }

        // 
        $image = $data['article_image_path'];
        $data['edited_by'] = Auth::user()->id;
        $data['slug'] = Str::slug($request->title);

         //the reject message message 
        $data['rejection_message'] = $request->input('rejection_message');
        

        if ($image) {
            // Delete the old image file if a new one is uploaded
            if ($editor_article->article_image_path) {
                Storage::disk('public')->delete($editor_article->article_image_path);
            }
            // Store the new image directly under the 'article/' directory
            $data['article_image_path'] = $image->store('article', 'public');

            $data['layout_by'] = Auth::user()->id;

        } else {
            // If no new image is uploaded, keep the existing image
            $data['article_image_path'] = $editor_article->article_image_path;
        }

        $editor_article->update($data);

        return to_route('editor-article.index')->with(['success' => 'Article Edited Successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $editor_article)
    {
        // dd($article);
        $editor_article->delete();

        if ($editor_article->article_image_path) {
            // Delete the specific old image file
            Storage::disk('public')->delete($editor_article->article_image_path);
        }
        return to_route('editor-article.index')->with(['delete_success' => 'Deleted Successfully']);
    }
}
