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
use App\Models\User;
use App\Models\Word;
use App\Utilities\AhoCorasick;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

use Illuminate\Support\Facades\Notification;
use App\Notifications\ArticleStatus;//change


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

                 //do now show the article in the table if edited_by !== editor_id
                //ang naa sa table is tanan arti status pending, revision basta wapa na edit(null) or siya ang ga edit,
                // og maka edit siya na published na arti pero di ma change ang editeb_by[in update func] = to avoid exploiting in making acc report

                $query->where(function ($query) use ($id) {
                    $query->where('created_by', $id) // Auth user's articles
                        ->orWhere(function ($query) use ($id) {
                            $query->where('created_by', '!=', $id)
                                ->where(function ($q) {
                                    // Include all published articles
                                    $q->where('status', 'published');
                                })
                                ->orWhere(function ($query) use ($id) {
                                    $query->whereIn('status', ['pending', 'revision', 'edited']) 
                                        ->where('draft', 'no')
                                        ->where(function ($query) use ($id) {
                                            $query->whereNull('edited_by')  // Include records where edited_by is NULL
                                                ->orWhere('edited_by', $id); // Include records where edited_by equals the user ID
                                        });
                                });
                        });
                });


                break;
        }
        // Sorting the results
        $articles = $query->orderBy($sortField, $sortDirection)
                            ->where('visibility', 'visible')
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

        // 
        $image = $data['article_image_path'];
        $data['created_by'] = Auth::user()->id;
        $data['edited_by'] = Auth::user()->id;
        $data['academic_year_id'] = $activeAy->id;
        $data['submitted_at'] =now();
        $data['edited_at'] =now();
        // $data['status'] = 'edited';

        $data['slug'] = Str::slug($request->title);

        if ($image) {
            // Store the image directly under the 'article/' directory and save its path
            $data['article_image_path'] = $image->store('article', 'public');
            $data['layout_by'] = Auth::user()->id;
        }

        $editor_article = Article::create($data);

        if ($data['status'] === 'draft') {
            return to_route('editor-article.index')->with(['success' => 'Article saved as draft.']);
        }

        // ==============send email notif ==================//

        $createdBy = $editor_article->createdBy;
        $editedBy = Auth::user();  // Use the currently authenticated user who made the edit

        // Prepare task details for the notification
        $articleDetails = [
            'id' => $editor_article->id,
            'title' => $editor_article->title,  
            'created_by' => $createdBy->name,
            'edited_by' => $editedBy->name,
            'status' => $editor_article->status,
        ];

        // dd('edited');

        $customAdminMessage = 'The article is currently being submitted by ' . $editedBy->name . ' and is awaiting publication.';

        if ($editor_article->status === 'edited') {

            // Fetch all admin users
            $allAdmins = User::where('role', 'admin')->get();  // Assuming 'role' is the column

            Notification::send($allAdmins, new ArticleStatus($articleDetails, $customAdminMessage));

            return to_route('editor-article.index')->with(['success'=> 'Article submitted successfully.']);
        }

        return to_route('editor-article.index')->with(['success'=> 'Article submitted successfully.']);
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
    
    public function timeLine($id)
    {
        $article = Article::find($id);
        // dd($article);
        return inertia('Editor/Article/Timeline', [
            'article' => new ArticleResource($article),
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
    public function update(EditorUpdateArticleRequest $request, $id)
    {
        $editor_article = Article::find($id);

        // dd($editor_article);

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

        // 
        $image = $data['article_image_path'];
        $data['edited_by'] = Auth::user()->id;
        $data['slug'] = Str::slug($request->title);

        //if ge edit but published na as is ang edited_by[i mention in index func]
        if($editor_article->status !== 'published'){
            $data['edited_by'] = Auth::user()->id;
        }elseif($editor_article->status === 'published'){
            $data['edited_by'] = $editor_article->edited_by;
        }

         //the reject message message 
        $data['rejection_message'] = $request->input('rejection_message');

        // dates

         //if edited put the date
        if($data['status'] === 'edited'){
            $data['edited_at'] = now();
        }

        //if rejected put the date
        if($data['status'] === 'rejected'){
            $data['rejected_at'] = now();
        }

        // $status = $data['status'];
        // $editorId = Auth::user()->id;

        //wako kasabot para asa ni nga code hHAHAHAHA
        //og kinsa nag edit??? limot ko 
        //Wala ni pulos na code
        // if ($status === 'revision' && $editorId === $editor_article->created_by){
        //     $data['status'] = 'edited';
        // }

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


        // ==============send email notif ==================//

        $editorId = Auth::user()->id;

        $createdBy = $editor_article->createdBy;
        $editedBy = Auth::user();  // Use the currently authenticated user who made the edit

        // Prepare task details for the notification
        $articleDetails = [
            'id' => $editor_article->id,
            'title' => $editor_article->title,  
            'created_by' => $createdBy->name,
            'edited_by' => $editedBy->name,
            'status' => $editor_article->status,
        ];

        // dd('edited');

        // Customize the message based on the task status
        $customEditedMessage = 'Your article has been edited by ' . $editedBy->name . ' and is now awaiting publication. The admin will review the edited article shortly before it is published.';

        $customRejectedMessage = 'Unfortunately, your article has been rejected by ' . $editedBy->name . '. The reason provided for the rejection is: "' . $editor_article->rejection_message . '". Please review the feedback and consider making the necessary changes before resubmitting.';


        $customAdminMessage = 'The article is currently being edited by ' . $editedBy->name . ' and is awaiting publication. It is now waiting for your review before it can be published.';

        // Send the email notification to the article's creator
        if ($editor_article->status === 'edited') {
            Notification::send($createdBy, new ArticleStatus($articleDetails, $customEditedMessage));

            // Fetch all admin users
            $allAdmins = User::where('role', 'admin')->get();

            // Send notification to all admin users
            Notification::send($allAdmins, new ArticleStatus($articleDetails, $customAdminMessage));

            return to_route('editor-article.index')->with(['success' => 'Article edited succesfullly.']);
        }

        if ($editor_article->created_by !== $editorId && $editor_article->status === 'rejected') {
            Notification::send($createdBy, new ArticleStatus($articleDetails, $customRejectedMessage));

            return to_route('editor-article.index')->with(['success' => 'Article rejected successfully.']);
        }

        if ($data['status'] === 'draft') {
            return to_route('editor-article.index')->with(['success' => 'Article saved as draft.']);
        }

        return to_route('editor-article.index')->with(['success' => 'Article edited successfully.']);
    }

    /**
     * Remove the specified resource from storage.
     */
    //do not destroy insted archive
    public function destroy(Article $editor_article)
    {
        // // dd($article);
        // $editor_article->delete();

        // if ($editor_article->article_image_path) {
        //     // Delete the specific old image file
        //     Storage::disk('public')->delete($editor_article->article_image_path);
        // }

        if(!$editor_article){
            return back()->with('error', 'Article not found');
        }

        $editor_article->update(['visibility' => 'hidden']);


        return to_route('editor-article.index')->with(['success' => 'Archive successfully']);
    }


    public function calendar()
    {
        $articles = Article::where('status', operator: 'published')
                            ->where('created_by' , Auth::user()->id)
                            ->whereNotNull('published_date')
                            ->get(['id','title', 'status', 'published_date']);

        // $article = Article::select('id', 'name', 'status', 'assigned_date' ,'task_completed_date')->get();

        // Render the calendar page with article passed as props
        return inertia('Editor/Article/MyCalendar', [
            'articles' => $articles
        ]);
    }
}
