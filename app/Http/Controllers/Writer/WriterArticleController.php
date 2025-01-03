<?php

namespace App\Http\Controllers\Writer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\StudentStoreArticleRequest;
use App\Http\Requests\Student\StudentUpdateArticleRequest;
use App\Http\Requests\Writer\WriterStoreArticleRequest;
use App\Http\Requests\Writer\WriterUpdateArticleRequest;
use App\Http\Resources\AcademicYearResource;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CategoryResource;
use App\Models\AcademicYear;
use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use App\Models\Word;
use App\Notifications\ArticleStatus;
use App\Utilities\AhoCorasick;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class WriterArticleController extends Controller
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
                            ->where('visibility', 'visible')
                            ->paginate(10)
                            ->onEachSide(1);

        return inertia('Writer/Article/Index', [
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
        $categories = Category::where('status', 'active')->get();

        return inertia('Writer/Article/Create', [
            'categories' => CategoryResource::collection($categories),
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    //writer req AHAHA bala basta mo gana | same validation ra sa writer
    public function store(WriterStoreArticleRequest $request)
    {
        $data = $request->validated();

        // dd($data);

        // limitations
        $entriesCount = Article::where('created_by', auth()->id())
                        ->where('created_at', '>=', now('Asia/Manila')->subDay()) // Check entries within the last 24 hours
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

        //sanitize for base64
        function sanitizeContent($body) {
            // Regular expression to match base64 image data (including jpg, jpeg, png, gif)
            //wa na gamit
            $base64Pattern = '/data:image\/(?:jpeg|jpg|png|gif);base64,[a-zA-Z0-9\/+\r\n]+={0,2}/';
            
            // Regular expression to match <figure>, <oembed>, and <a> tags (removes embedded URLs and links)
            $urlPattern = '/<figure.*?>.*?<\/figure>|<oembed.*?>.*?<\/oembed>|<a.*?>.*?<\/a>/i';
            
            // Remove all base64 image data
            $body = preg_replace($base64Pattern, '', $body);
            
            // Remove all embedded URLs and links (<figure>, <oembed>, and <a> tags)
            return preg_replace($urlPattern, '', $body);
        }

        $sanitizedBody = sanitizeContent($data['body']);


        // Check if the article body contains any bad words
        $detectedWords = $ahoCorasick->search($sanitizedBody);
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
        $data['submitted_at'] = now('Asia/Manila');
        $data['academic_year_id'] = $activeAy->id;

        // $data['slug'] = Str::slug($request->title) . '-' . time();
        $data['slug'] = Str::slug(iconv('UTF-8', 'ASCII//TRANSLIT', $request->title));

        if ($image) {
            // Store the image directly under the 'article/' directory and save its path
            $data['article_image_path'] = $image->store('article', 'public');
            $data['layout_by'] = Auth::user()->id;
        }

        $writer_article = Article::create($data);

        if($data['status'] === 'draft'){
            return to_route('writer-article.index')->with(['success' => 'Article saved as draft.']);
        }

        // ==============send email notif ==================//

        $createdBy = $writer_article->createdBy;
        // $editedBy = $writer_article->editedBy;  // Use the currently authenticated user who made the edit

        // Prepare task details for the notification
        $articleDetails = [
            'id' => $writer_article->id,
            'title' => $writer_article->title,  
            'created_by' => $createdBy->name,
            'status' => $writer_article->status,
        ];

        // dd('edited');

        $customEditorMessage = 'The article submitted by ' . $createdBy->name . ' is currently awaiting editing. Please review it at your earliest convenience.';


        if ($writer_article->status === 'pending') {

            // Fetch all admin users
            $allEditors = User::where('role', 'editor')->get();  // Assuming 'role' is the column

            Notification::send($allEditors, new ArticleStatus($articleDetails, $customEditorMessage));

            return to_route('writer-article.index')->with(['success'=> 'Article submitted successfully.']);
        }

        return to_route('writer-article.index')->with(['success' => 'Article submitted successfully.']);
    }

    /**
     * Display the specified resource.
     */
    public function show($slug)
    {
        
        $article = Article::where('slug', $slug)
                    ->where('created_by', Auth::user()->id)
                    ->where('visibility', 'visible')
                    ->firstOrFail();

        return inertia('Writer/Article/Show', [
            'article' => new ArticleResource($article),
        ]);
    }

    public function timeLine($slug)
    {
        // $article = Article::find($id);

        $article = Article::where('slug', $slug)
                ->where('created_by', Auth::user()->id)
                ->where('visibility', 'visible')
                ->firstOrFail();
                
        // dd($article);
        return inertia('Writer/Article/Timeline', [
            'article' => new ArticleResource($article),
        ]);
    }



    /**
     * Show the form for editing the specified resource.
     */
    public function edit($slug)
    {
        $article = Article::where('slug', $slug)
                    ->where('created_by', Auth::user()->id)
                    ->where('visibility', 'visible')
                    ->firstOrFail();

        $categories = Category::where('status', 'active')->get();

        return inertia('Writer/Article/Edit', [
            'article' => new ArticleResource($article),
            'categories' => CategoryResource::collection($categories),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(WriterUpdateArticleRequest $request, Article $writer_article)
    {
        // dd($request);
        $data = $request->validated();

        // dd($data);

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

        //sanitize for base64
        function sanitizeContent($body) {
            // Regular expression to match base64 image data (including jpg, jpeg, png, gif)
            //wa na gamit
            $base64Pattern = '/data:image\/(?:jpeg|jpg|png|gif);base64,[a-zA-Z0-9\/+\r\n]+={0,2}/';
            
            // Regular expression to match <figure>, <oembed>, and <a> tags (removes embedded URLs and links)
            $urlPattern = '/<figure.*?>.*?<\/figure>|<oembed.*?>.*?<\/oembed>|<a.*?>.*?<\/a>/i';
            
            // Remove all base64 image data
            $body = preg_replace($base64Pattern, '', $body);
            
            // Remove all embedded URLs and links (<figure>, <oembed>, and <a> tags)
            return preg_replace($urlPattern, '', $body);
        }

        $sanitizedBody = sanitizeContent($data['body']);


        // Check if the article body contains any bad words
        $detectedWords = $ahoCorasick->search($sanitizedBody);
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
        // $status = $data['status'];
        $status = $writer_article->status;
        
        if (in_array($status, ['edited', 'revision', 'published'])) {
            // Only update the 'is_anonymous' field
            $writer_article->update(['is_anonymous' => $data['is_anonymous']]);
        } else if (in_array($status, ['draft','pending', 'rejected'])) {
            // Update all fields

            $image = $data['article_image_path'];
            $data['created_by'] = Auth::user()->id;
            $data['submitted_at'] = now('Asia/Manila');

            // $data['slug'] = Str::slug($request->title) . '-' . time();
            $data['slug'] = Str::slug(iconv('UTF-8', 'ASCII//TRANSLIT', $request->title));
            

            if ($image) {
                // Delete the old image file if a new one is uploaded
                if ($writer_article->article_image_path) {
                    Storage::disk('public')->delete($writer_article->article_image_path);
                }
                // Store the new image under the 'article/' directory
                $data['article_image_path'] = $image->store('article', 'public');
                $data['layout_by'] = Auth::user()->id;
            } else {
                // Keep the existing image
                $data['article_image_path'] = $writer_article->article_image_path;
            }


            $writer_article->update($data);
        }

        if($data['status'] === 'draft'){
            return to_route('writer-article.index')->with(['success' => 'Article saved as draft.']);
        }

        // ==============send email notif ==================//

        $createdBy = $writer_article->createdBy;
        $editedBy = $writer_article->editedBy;  // Use the currently authenticated user who made the edit

        // dd($editedBy);

        // Prepare task details for the notification
        $articleDetails = [
            'id' => $writer_article->id,
            'title' => $writer_article->title,  
            'created_by' => $createdBy->name,
            'status' => $writer_article->status,
        ];

        // dd('edited');

        $customEditorMessage = 'The article submitted by ' . $createdBy->name . ' is currently awaiting editing. Please review it at your earliest convenience.';

        if ($writer_article->status === 'pending') {


        if(!$editedBy){
                // Fetch all admin users
                $allEditors = User::where('role', 'editor')->get();  // Assuming 'role' is the column

                Notification::send($allEditors, new ArticleStatus($articleDetails, $customEditorMessage));

                return to_route('writer-article.index')->with(['success'=> 'Article submitted successfully.']);
            }
        }
        
        if ($editedBy) {
                Notification::send($editedBy, new ArticleStatus($articleDetails, $customEditorMessage));

                return to_route('writer-article.index')->with(['success' => 'Article edited successfully']);
        }


        return to_route('writer-article.index')->with(['success' => 'Article Edited successfully.']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $writer_article)
    {
        // dd($article);
        // $writer_article->delete();

        // if ($writer_article->article_image_path) {
        //     // Delete the specific old image file
        //     Storage::disk('public')->delete($writer_article->article_image_path);
        // }

        //Archive
        if(!$writer_article){
            return back()->with('error', 'Article not found');
        }

        $writer_article->update(['archive_by' => Auth::user()->id ]);
        $writer_article->update(['visibility' => 'hidden']);

        return to_route('writer-article.index')->with(['success' => 'Archive successfully.']);
    }

    
    public function calendar()
    {
        $articles = Article::where('status', operator: 'published')
                            ->where('visibility', 'visible') 
                            ->where('created_by' , Auth::user()->id)
                            ->whereNotNull('published_date')
                            ->get(['id','slug','title', 'status', 'published_date']);

        // $article = Article::select('id', 'name', 'status', 'assigned_date' ,'task_completed_date')->get();

        // Render the calendar page with article passed as props
        return inertia('Writer/Article/MyCalendar', [
            'articles' => $articles
        ]);
    }
}
