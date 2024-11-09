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
use App\Models\User;
use App\Models\Word;
use App\Notifications\ArticleStatus;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
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
                                        ->whereIn('status', ['edited','scheduled', 'published']); 
                            });
                    });
                break;
        }
        

        $admin_articles = $query->orderBy($sortField, $sortDirection)
                                ->where('visibility', 'visible')
                                ->paginate(10)
                                ->onEachSide(1);

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

        if($data['status'] === 'scheduled' && $data['published_date'] < now()){
            return redirect()->back()->withErrors(['published_date' => 'For scheduled status, the published date must be in the future.']);
        }

        // 
        $image = $data['article_image_path'];
        $data['created_by'] = Auth::user()->id;
        $data['edited_by'] = Auth::user()->id;
        $data['layout_by'] = Auth::user()->id;
        $data['published_by'] = Auth::user()->id;
        $data['submitted_at'] = now();
        $data['edited_at'] = now();
        
        //alter fonts not recommended
        $data['slug'] = Str::slug($request->title) . '-' . time();// add the current time para prevent og di basahon ang font sa titel

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
    public function show($slug)
    {
        $id = Auth::user()->id;

        $article = Article::where('slug', $slug)
        ->where('visibility', 'visible') 
        ->where(function ($query) use ($id) {
            // Articles created by the authenticated user
            $query->where('created_by', $id)
                ->orWhere(function ($query) use ($id) {
                                $query->where('created_by', '!=', $id)
                                        ->whereIn('status', ['edited','scheduled', 'published']); 
                            });
        })
        ->firstOrFail();


        return inertia('Admin/Article/Show', [
            'article' => new ArticleResource($article),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function timeLine($slug)
    {
        // $article = Article::find($id);
        $id = Auth::user()->id;

        $article = Article::where('slug', $slug)
        ->where('visibility', 'visible') 
        ->where(function ($query) use ($id) {
            // Articles created by the authenticated user
            $query->where('created_by', $id)
                ->orWhere(function ($query) use ($id) {
                                $query->where('created_by', '!=', $id)
                                        ->whereIn('status', ['edited','scheduled', 'published']); 
                            });
        })
        ->firstOrFail();

        // dd($article);
        return inertia('Admin/Article/Timeline', [
            'article' => new ArticleResource($article),
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit($slug)
    {
        // $activeAy = AcademicYear::where('status', 'active')->first();//for non admin
        $activeAy = AcademicYear::all();//for admin

        if (!$activeAy) {
            $activeAy = AcademicYear::orderBy('created_at', 'desc')->first();
        }

        $id = Auth::user()->id;

        $article = Article::where('slug', $slug)
        ->where('visibility', 'visible') 
        ->where(function ($query) use ($id) {
            // Articles created by the authenticated user
            $query->where('created_by', $id)
                ->orWhere(function ($query) use ($id) {
                                $query->where('created_by', '!=', $id)
                                        ->whereIn('status', ['edited','scheduled', 'published']); 
                            });
        })
        ->firstOrFail();

        $categories = Category::all();

        return inertia('Admin/Article/Edit', [
            'article' => new ArticleResource($article),
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

        
        $image = $data['article_image_path'];
        $data['slug'] = Str::slug($request->title) . '-' . time();

        //the revision or reject message message 
        $data['revision_message'] = $request->input('revision_message');
        

        if($data['status'] === 'scheduled' && $data['published_date'] < now()){
            return redirect()->back()->withErrors(['published_date' => 'For scheduled status, the published date must be in the future.']);
        }

        // If the article is already published, retain the existing published date
        if($admin_article->status === 'published'){
            $data['published_date'] = $admin_article->published_date;
        }

        // If the article is being published for the first time, set the published date
        elseif ($data['status'] === 'published' && $admin_article->status !== 'published') {
            $data['published_date'] = $data['published_date'] ?? now();
            $data['published_by'] = Auth::user()->id;
        }

        if ($data['status'] !== 'published' && $data['status'] !== 'scheduled') {
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

        // ==============send email notif ==================//

        $createdBy = $admin_article->createdBy;
        $editedBy = $admin_article->editedBy; 

        // Prepare task details for the notification
        $articleDetails = [
            'id' => $admin_article->id,
            'title' => $admin_article->title,  
            'created_by' => $createdBy->name,
            'edited_by' => $editedBy->name,
            'status' => $admin_article->status,
        ];

        // dd('edited');

        $customEditorRevisionMessage = 'The article you previously edited has been reviewed and requires further revisions. Please take a moment to review the suggested changes and make the necessary adjustments for final approval.';

        $customRejectionMessage = 'Your article, edited by ' . $editedBy->name . ', has been reviewed and unfortunately does not meet the required standards.';

        $customEditorPublishedMessage = 'Great job! The article you edited has been successfully published and is now live for readers to view. Thank you for your attention to detail and hard work in preparing it for publication.';

        $customPublishedMessage = 'Congratulations! Your article, edited by ' . $editedBy->name . ', has been successfully published. It is now live for readers to enjoy. Thank you for your hard work and contribution!';
        
        $customEditorPublishedMessage = 'Great job! The article you edited has been successfully sceduled for publication. Thank you for your attention to detail and hard work in preparing it for publication.';

        $customScheduledMessage = 'Congratulations! Your article, edited by ' . $editedBy->name . ', has been successfully scheduled for publication. Thank you for your hard work and valuable contribution!';

        

        if ($admin_article->status === 'revision') {

            Notification::send($editedBy, new ArticleStatus($articleDetails, $customEditorRevisionMessage));
            Notification::send($createdBy, new ArticleStatus($articleDetails, $customRejectionMessage));

            return to_route('admin-article.index')->with(['success'=> 'Article needed revision.']);
        }

        if ($admin_article->status === 'published') {

            Notification::send($editedBy, new ArticleStatus($articleDetails, $customEditorPublishedMessage));
            Notification::send($createdBy, new ArticleStatus($articleDetails, $customPublishedMessage));

            return to_route('admin-article.index')->with(['success'=> 'Article published succesfullly.']);
        }

        if ($admin_article->status === 'scheduled') {

            Notification::send($editedBy, new ArticleStatus($articleDetails, $customEditorPublishedMessage));
            Notification::send($createdBy, new ArticleStatus($articleDetails, $customScheduledMessage));

            return to_route('admin-article.index')->with(['success'=> 'Article published succesfullly.']);
        }

        return to_route('admin-article.index')->with([ 'success' => 'Article updated successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    //Archive instead e delete
    public function destroy(Article $admin_article)
    {
        // dd($admin_article);
        // $admin_article->delete();

        // if ($admin_article->article_image_path) {
        //     // Delete the specific old image file
        //     Storage::disk('public')->delete($admin_article->article_image_path);
        // }

        if(!$admin_article){
            return back()->with('error', 'Article not found.');
        }

        $admin_article->update(['archive_by' => Auth::user()->id ]);
        $admin_article->update(['visibility' => 'hidden']);

        return to_route('admin-article.index')->with(['success' => 'Archive successfully.']);
    }


    public function calendar()
    {
        $articles = Article::where('status', operator: 'published')
                            ->whereNotNull('published_date')
                            ->get(['id','slug','title', 'status', 'published_date']);

        // $article = Article::select('id', 'name', 'status', 'assigned_date' ,'task_completed_date')->get();

        // Render the calendar page with article passed as props
        return inertia('Admin/Article/MyCalendar', [
            'articles' => $articles
        ]);
    }
}
