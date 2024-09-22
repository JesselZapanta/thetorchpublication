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
        // dd($request);
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
        $data['created_by'] = Auth::user()->id;
        $data['edited_by'] = Auth::user()->id;
        $data['layout_by'] = Auth::user()->id;
        $data['published_by'] = Auth::user()->id;
        $data['submitted_at'] = now();
        $data['edited_at'] = now();
        

        $data['slug'] = Str::slug($request->title);//might remoce later

        if ($image) {
            // Store the image directly under the 'article/' directory and save its path
            $data['article_image_path'] = $image->store('article', 'public');
        }

        if($data['is_featured'] === "yes") {
            // Set all existing is_featured status to 'no'
            Article::query()->update(['is_featured' => "no"]);
        }

        Article::create($data);

        if ($data['status'] === 'draft') {
            return to_route('admin-article.index')->with(['success' => 'Article saved as draft.']);
        }

        return to_route('admin-article.index')->with(['success' => 'Article Created Successfully.']);
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
     * Display the specified resource.
     */
    public function timeLine($id)
    {
        $article = Article::find($id);
        // dd($article);
        return inertia('Admin/Article/Timeline', [
            'article' => new ArticleResource($article),
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

        
        $image = $data['article_image_path'];
        $data['slug'] = Str::slug($request->title);

        //the revision or reject message message 
        $data['revision_message'] = $request->input('revision_message');
        

        // if($status == 'published'){
        //     $data['revision_message'] = null;
        //     $data['rejection_message'] = null;
        // }

        // If the article is already published, retain the existing published date
        if($admin_article->status === 'published'){
            $data['published_date'] = $admin_article->published_date;
        }

        // If the article is being published for the first time, set the published date
        elseif ($data['status'] === 'published' && $admin_article->status !== 'published') {
            $data['published_date'] = now();
            $data['published_by'] = Auth::user()->id;
        }

        if($data['status'] !== 'published'){
            $data['published_date'] = null;
        }

        if($data['status'] === 'revision'){
            $data['revision_at'] = now();
            $data['revision_by'] = Auth::user()->id;
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

        if ($data['status'] === 'draft') {
            return to_route('admin-article.index')->with(['success' => 'Article saved as draft.']);
        }

        if ($data['status'] === 'published') {
            return to_route('admin-article.index')->with(['success' => 'Article published succesfullly.']);
        }

        if ($data['status'] === 'revision') {
            return to_route('admin-article.index')->with(['success' => 'Article needed revision.']);
        }

        return to_route('admin-article.index')->with([ 'success' => 'Article updated successfully']);
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


    public function calendar()
    {
        $articles = Article::where('status', operator: 'published')
                            ->whereNotNull('published_date')
                            ->get(['id','title', 'status', 'published_date']);

        // $article = Article::select('id', 'name', 'status', 'assigned_date' ,'task_completed_date')->get();

        // Render the calendar page with article passed as props
        return inertia('Admin/Article/MyCalendar', [
            'articles' => $articles
        ]);
    }
}
