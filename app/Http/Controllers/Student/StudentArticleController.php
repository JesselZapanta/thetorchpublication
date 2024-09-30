<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\StudentStoreArticleRequest;
use App\Http\Requests\Student\StudentUpdateArticleRequest;
use App\Http\Resources\AcademicYearResource;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CategoryResource;
use App\Models\AcademicYear;
use App\Models\Article;
use App\Models\Category;
use App\Models\Word;
use App\Utilities\AhoCorasick;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

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
        
        if (request('academic_year_id')) {
            // Join with the academicYear table to search by name
            $query->whereHas('academicYear', function ($q) {
                $q->where('code', 'like', '%' . request('academic_year_id') . '%');
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

        $academicYears = AcademicYear::all();
        $categories = Category::all();

        $articles = $query->where('created_by', $id)
                            ->orderBy($sortField, $sortDirection)
                            ->paginate(10)
                            ->onEachSide(1);

        return inertia('Student/Article/Index', [
            'articles' => ArticleResource::collection($articles),
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

        
        // limitations
        $entriesCount = Article::where('created_by', auth()->id())
                        ->where('created_at', '>=', now()->subDay()) // Check entries within the last 24 hours
                        ->where('status', '!=', 'draft') // Exclude drafts
                        ->count();

        if ($entriesCount >= 10 && $data['status'] !== 'draft') {
            return redirect()->back()->withErrors(['status' => 'You can only post 10 articles per day. Saved as Draft.']);
            
        }

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

        $image = $data['article_image_path'];
        $data['created_by'] = Auth::user()->id;
        $data['submitted_at'] =now();
        $data['academic_year_id'] = $activeAy->id;

        $data['slug'] = Str::slug($request->title);

        if ($image) {
            // Store the image directly under the 'article/' directory and save its path
            $data['article_image_path'] = $image->store('article', 'public');
            $data['layout_by'] = Auth::user()->id;
        }

        Article::create($data);

        if($data['status'] === 'draft'){
            return to_route('student-article.index')->with(['success' => 'Article saved as draft.']);
        }

        return to_route('student-article.index')->with(['success' => 'Article submitted successfully']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Article $student_article)
    {
        return inertia('Student/Article/Show', [
            'article' => new ArticleResource($student_article),
        ]);
    }

    public function timeLine($id)
    {
        $article = Article::find($id);
        // dd($article);
        return inertia('Student/Article/Timeline', [
            'article' => new ArticleResource($article),
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */

    public function edit(Article $student_article)
    {
        $categories = Category::all();

        return inertia('Student/Article/Edit', [
            'article' => new ArticleResource($student_article),
            'categories' => CategoryResource::collection($categories),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StudentUpdateArticleRequest $request, Article $student_article)
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

        // Logic based on status
        $status = $data['status'];
        
        if (in_array($status, ['edited', 'revision', 'published'])) {
            // Only update the 'is_anonymous' field
            $student_article->update(['is_anonymous' => $data['is_anonymous']]);
        } else if (in_array($status, ['pending', 'rejected'])) {
            // Update all fields

            $image = $data['article_image_path'] ?? null;
            $data['created_by'] = Auth::user()->id;
            $data['status'] = 'pending'; // Always set to 'pending'
            $data['slug'] = Str::slug($data['title']);

            if ($image) {
                // Delete the old image file if a new one is uploaded
                if ($student_article->article_image_path) {
                    Storage::disk('public')->delete($student_article->article_image_path);
                }
                // Store the new image under the 'article/' directory
                $data['article_image_path'] = $image->store('article', 'public');
                $data['layout_by'] = Auth::user()->id;
            } else {
                // Keep the existing image
                $data['article_image_path'] = $student_article->article_image_path;
            }


            $student_article->update($data);
        }
        if($data['status'] === 'draft'){
            return to_route('student-article.index')->with(['success' => 'Article saved as draft.']);
        }

        return to_route('student-article.index')->with(['success' => 'Article updated successfully']);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $student_article)
    {
        // dd($article);
        $student_article->delete();

        if ($student_article->article_image_path) {
            // Delete the specific old image file
            Storage::disk('public')->delete($student_article->article_image_path);
        }
        return to_route('student-article.index')->with(['success' => 'Deleted Successfully']);
    }


    
    public function calendar()
    {
        $articles = Article::where('status', operator: 'published')
                            ->where('created_by' , Auth::user()->id)
                            ->whereNotNull('published_date')
                            ->get(['id','title', 'status', 'published_date']);

        // $article = Article::select('id', 'name', 'status', 'assigned_date' ,'task_completed_date')->get();

        // Render the calendar page with article passed as props
        return inertia('Student/Article/MyCalendar', [
            'articles' => $articles
        ]);
    }
}
