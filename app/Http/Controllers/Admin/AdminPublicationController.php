<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AcademicYearResource;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\JobResource;
use App\Http\Resources\NewsletterResource;
use App\Http\Resources\PublicationResource;
use App\Jobs\SendNewsletterEmail;
use App\Models\AcademicYear;
use App\Models\Article;
use App\Models\Category;
use App\Models\Job;
use App\Models\Publication;
use App\Http\Requests\StorePublicationRequest;
use App\Http\Requests\UpdatePublicationRequest;
use App\Models\User;
use App\Models\Word;
use App\Notifications\NewsletterNotification;
use App\Utilities\AhoCorasick;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;


class AdminPublicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Publication::query();

        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');
        
        
        if(request('description')){
            $query->where('description', 'like', '%'. request('description') . '%');
        }

        if(request('status')){
            $query->where('status', request('status'));
        }

        if(request('category')){
            $query->where('category', request('category'));
        }

        $id = Auth::user()->id;



        // $publications = $query->where('visibility', 'visible')
        //     ->where(function ($query) use ($id) {
        //         // Get all publications if auth user is the layout_by, regardless of status
        //         $query->where('layout_by', $id);
        //     })
        //     ->orWhere(function ($query) use ($id) {
        //         // Get all publications where layout_by is NOT the auth user or NULL, and status is pending or approved
        //         $query->where(function ($subQuery) use ($id) {
        //             $subQuery->where('layout_by', '!=', $id)
        //                 ->orWhereNull('layout_by');
        //         })
        //         ->whereIn('status', ['pending', 'approved', 'revision', 'distributed'])
        //         ->where('visibility', 'visible'); // Ensure visibility check here as well
        //     })
        $publications = $query->where('visibility', 'visible')
        ->where(function ($query) use ($id) {
            $query->where('layout_by', $id)
                ->orWhere(function ($query) use ($id) {
                    $query->where(function ($subQuery) use ($id) {
                        $subQuery->where('layout_by', '!=', $id)
                            ->orWhereNull('layout_by');
                    })
                    ->whereIn('status', ['pending', 'approved', 'revision', 'distributed'])
                    ->where('visibility', 'visible');
                });
        })
        ->orderBy($sortField, $sortDirection)
        ->paginate(10)
        ->onEachSide(1);

        
        return inertia('Admin/Publication/Index', [
            'publications' => PublicationResource::collection($publications),
            'queryParams' => request()->query() ? : null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $activeAy = AcademicYear::all();
        return inertia('Admin/Publication/Create', [
            'activeAy' => AcademicYearResource::collection($activeAy),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePublicationRequest $request)
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

        // Check if the article description contains any bad words
        $detectedWords = $ahoCorasick->search(strtolower($data['description']));
        if (!empty($detectedWords)) {
            $errors['description'] = 'The description contains inappropriate content: ' . implode(', ', $detectedWords);
        }

        // If there are any errors, return them
        if (!empty($errors)) {
            return redirect()->back()->withErrors($errors);
        }

        $image = $data['publication_thumbnail_image_path'];
        $pdfFile = $data['publication_file_path'];

        if ($image) {
            // Store the image directly under the 'publication-thumbnail/' directory and save its path
            $data['publication_thumbnail_image_path'] = $image->store('publication-thumbnail', 'public');
        }

        if ($pdfFile) {
            // Store the image directly under the 'publication-file/' directory and save its path
            $data['publication_file_path'] = $pdfFile->store('publication-file', 'public');
        }

        $data['layout_by'] = Auth::user()->id;
        $data['submitted_at'] = now('Asia/Manila');

        Publication::create($data);

        return to_route('publication.index')->with(['success' => 'Publication submitted Successfully']);
    }


    public function timeLine($id)
    {
        $publication = Publication::find($id);

        return inertia('Admin/Publication/Timeline', [
            'publication' => new PublicationResource($publication),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $publication = Publication::findOrFail($id);
        $activeAy = AcademicYear::all();
        return inertia('Admin/Publication/Edit', [
            'publication' => new PublicationResource($publication),
            'activeAy' => AcademicYearResource::collection($activeAy),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePublicationRequest $request, Publication $publication)
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

        // Check if the article description contains any bad words
        $detectedWords = $ahoCorasick->search(strtolower($data['description']));
        if (!empty($detectedWords)) {
            $errors['description'] = 'The description contains inappropriate content: ' . implode(', ', $detectedWords);
        }

        // If there are any errors, return them
        if (!empty($errors)) {
            return redirect()->back()->withErrors($errors);
        }

        // dd($data['publication_file_path']);
        $image = $data['publication_thumbnail_image_path'];
        $pdfFile = $data['publication_file_path'];

        if ($image) {
            // Delete the old image file if a new one is uploaded
            if ($publication->publication_thumbnail_image_path) {
                Storage::disk('public')->delete($publication->publication_thumbnail_image_path);
            }
            // Store the new image directly under the 'publication/' directory
            $data['publication_thumbnail_image_path'] = $image->store('publication-thumbnail', 'public');
        } else {
            // If no new image is uploaded, keep the existing image
            $data['publication_thumbnail_image_path'] = $publication->publication_thumbnail_image_path;
        }

        if ($pdfFile) {
            // Delete the old pdfFile file if a new one is uploaded
            if ($publication->publication_file_path) {
                Storage::disk('public')->delete($publication->publication_file_path);
            }
            // Store the new pdfFile directly under the 'publication/' directory
            $data['publication_file_path'] = $pdfFile->store('publication-file', 'public');
        } else {
            // If no new pdfFile is uploaded, keep the existing pdfFile
            $data['publication_file_path'] = $publication->publication_file_path;
        }

        if ($data['status'] === 'revision') {
            $data['revision_at'] = now('Asia/Manila');
            $data['revision_by'] = Auth::user()->id;
        }

        if ($data['status'] === 'approved') {
            $data['approved_at'] = now('Asia/Manila');
            $data['approved_by'] = Auth::user()->id;
        }


        $publication->update($data);

        if ($data['status'] === 'revision') {
            return to_route('publication.index')->with(['access' => 'Publication needed revision.']);
        }

        if ($data['status'] === 'approved') {
            return to_route('publication.index')->with(['access' => 'Publication approved successfully.']);
        }

        return to_route('publication.index')->with(['success' => 'Publication Updated Successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Publication $publication)
    {
        // $publication->delete();

        // if ($publication->publication_thumbnail_image_path) {
        //     // Delete the specific old image file
        //     Storage::disk('public')->delete($publication->publication_thumbnail_image_path);
        // }

        // if ($publication->publication_thumbnail_image_path) {
        //     // Delete the specific old  file
        //     Storage::disk('public')->delete($publication->publication_thumbnail_image_path);
        // }

        if(!$publication){
            return back()->with('error', 'Publication not found.');
        }

        $publication->update(['visibility' => 'hidden']);
        $publication->update(['archive_by' => Auth::user()->id ]);


        return to_route('publication.index')->with(['success' => 'Archive Successfully']);
    }

    public function distributeIndex($id)
    {
        $publication = Publication::findOrFail($id);

        if(!$publication){
            return to_route('publication.index')->with(['error' => 'Publication not Found']);
        }

        return inertia('Admin/Publication/Distribute', [
            'publication' => new PublicationResource($publication),
        ]);
    }

    public function distributeNewsletter(Request $request, Publication $publication)
    {
        // dd($publication);
        // Validate the message and password
        $request->validate([
            'message' => 'required|string',
            'password' => 'required|string',
        ]);

        // Verify the authenticated user's password
        if (!Hash::check($request->password, Auth::user()->password)) {
            return redirect()->back()->withErrors(['password' => 'Incorrect password.']);
        }

        // Check if the publication status is approved
        if ($publication->status !== 'approved' && $publication->status !== 'distributed') {
            return to_route('publication.index')->with(['error' => 'Publication has not been approved for distribution.']);
        }

        $publication->update(['status' => 'distributed']);
        $publication->update(['distributed_at' => now('Asia/Manila')]);
        $publication->update(['distributed_by' => Auth::user()->id]);


        //old version
         // Get all user emails
        // $users = User::pluck('email');

        // // Queue each email
        // foreach ($users as $email) {
        //     SendNewsletterEmail::dispatch($email, $publication, $request->message);
        // }

        //new version

        $customMessage = $request->message;

        $publicationDetails = [
            'id' => $publication->id,
            'category' => $publication->category, 
            'description' => $publication->description, 
            'publication_file_path' => $publication->publication_file_path, 
        ];


        $users = User::whereNotNull('email_verified_at')->get();

        Notification::send($users, new NewsletterNotification($publicationDetails, $customMessage));

        return to_route('publication.index')->with(['success' => 'Publication queued successfully. Distribution will begin shortly.']);
    }

    public function jobIndex()
    {
        // $jobs = Job::all(); // Fetch jobs from the default `jobs` table
        $query = Job::query();
        $jobs = $query->orderBy('id', 'asc')->paginate(10)->onEachSide(1);
        // dd($jobs);
        return inertia('Admin/Publication/Jobs', [
            'jobs' => JobResource::collection($jobs),
        ]);
    }
    
    public function SelectArticles()
    {
        $query = Article::query();
        $categories = Category::all();
        $academicYears = AcademicYear::all();

        $sortField = request('sort_field', 'published_date');
        $sortDirection = request('sort_direction', 'desc');
        
        
        if(request('title')){
            $query->where('title', 'like', '%'. request('title') . '%');
        }

        if(request('is_newsletter')){
            $query->where('is_newsletter', 'like', '%'. request('is_newsletter') . '%');
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

    
        $articles = $query->orderBy($sortField, $sortDirection)
                        //where the createdBy->role != 'student' 
                        ->where('status', 'published')
                        ->where('visibility', 'visible')
                        ->whereHas('createdBy', function ($query){
                            $query->where('role', '!=', 'student');
                        })
                        ->paginate(10)
                        ->onEachSide(1);

        return inertia('Admin/Publication/Article', [
            'articles' => ArticleResource::collection($articles),
            'categories' => CategoryResource::collection($categories),
            'academicYears' => AcademicYearResource::collection($academicYears),
            'queryParams' => request()->query() ? : null,
        ]);
    }

    public function articleShow($slug)
    {
        // $article = Article::findOrFail($id);
        $article = Article::where('slug', $slug)
                        ->where('status', 'published')  // Only published articles
                        ->where('visibility', 'visible')
                        ->whereHas('createdBy', function ($query){
                            $query->where('role', '!=', 'student');
                        })
                    ->firstOrFail();

        if(!$article){
            return to_route('publication.articles')->with(['error' => 'Article not Found']);
        }

        return inertia('Admin/Publication/Show', [
            'article' => new ArticleResource($article),
        ]);
    }


    public function addArticle($id)
    {
        $article = Article::findOrFail($id);

        if(!$article){
            return to_route('publication.articles')->with(['error' => 'Article not Found']);
        }

        $article->update(['is_newsletter' => 'yes']);

        return to_route('publication.articles')->with(['success' => 'Article is added to Publication']);
    }
    public function removeArticle($id)
    {
        $article = Article::findOrFail($id);

        if(!$article){
            return to_route('publication.articles')->with(['error' => 'Article not Found']);
        }

        $article->update(['is_newsletter' => 'no']);

        return to_route('publication.articles')->with(['success' => 'Article is remove to Publication']);
    }

    public function calendar()
    {
        $publications = Publication::where('status', 'distributed')
                            ->where('visibility', 'visible')
                            ->whereNotNull('distributed_at')
                            ->get(['id','description', 'distributed_at' ,'status',]);

        // dd($publications);
        // Render the calendar page with publication passed as props
        return inertia('Admin/Publication/MyCalendar', [
            'publications' => $publications,
        ]);
    }
}

