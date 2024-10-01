<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AcademicYearResource;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\JobResource;
use App\Http\Resources\NewsletterResource;
use App\Jobs\SendNewsletterEmail;
use App\Models\AcademicYear;
use App\Models\Article;
use App\Models\Category;
use App\Models\Job;
use App\Models\Newsletter;
use App\Http\Requests\StoreNewsletterRequest;
use App\Http\Requests\UpdateNewsletterRequest;
use App\Models\User;
use App\Notifications\NewsletterNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;


class AdminNewsletterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Newsletter::query();

        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');
        
        
        if(request('description')){
            $query->where('description', 'like', '%'. request('description') . '%');
        }

        if(request('status')){
            $query->where('status', request('status'));
        }

        $id = Auth::user()->id;

        $newsletters = $query->orderBy($sortField, $sortDirection)
            ->where(function ($query) use ($id) {
                // Get all newsletters if auth user is the layout_by, regardless of status
                $query->where('layout_by', $id);
            })
            ->orWhere(function ($query) use ($id) {
                // Get all newsletters where layout_by is NOT the auth user or NULL, and status is pending or approved
                $query->where(function ($query) use ($id) {
                    $query->where('layout_by', '!=', $id)
                        ->orWhereNull('layout_by');
                })
                ->whereIn('status', ['pending', 'approved', 'revision','distributed']);
            })
            ->paginate(10)
            ->onEachSide(1);

        
        return inertia('Admin/Newsletter/Index', [
            'newsletters' => NewsletterResource::collection($newsletters),
            'queryParams' => request()->query() ? : null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $activeAy = AcademicYear::all();
        return inertia('Admin/Newsletter/Create', [
            'activeAy' => AcademicYearResource::collection($activeAy),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNewsletterRequest $request)
    {
        $data = $request->validated();

        $image = $data['newsletter_thumbnail_image_path'];
        $pdfFile = $data['newsletter_file_path'];

        if ($image) {
            // Store the image directly under the 'newsletter-thumbnail/' directory and save its path
            $data['newsletter_thumbnail_image_path'] = $image->store('newsletter-thumbnail', 'public');
        }

        if ($pdfFile) {
            // Store the image directly under the 'newsletter-file/' directory and save its path
            $data['newsletter_file_path'] = $pdfFile->store('newsletter-file', 'public');
        }

        $data['layout_by'] = Auth::user()->id;
        $data['submitted_at'] = now();

        Newsletter::create($data);

        return to_route('newsletter.index')->with(['success' => 'Newsletter submitted Successfully']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Newsletter $newsletter)
    {
        
    }

    public function timeLine($id)
    {
        $newsletter = Newsletter::find($id);

        return inertia('Admin/Newsletter/Timeline', [
            'newsletter' => new NewsletterResource($newsletter),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Newsletter $newsletter)
    {
        $activeAy = AcademicYear::all();
        return inertia('Admin/Newsletter/Edit', [
            'newsletter' => new NewsletterResource($newsletter),
            'activeAy' => AcademicYearResource::collection($activeAy),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNewsletterRequest $request, Newsletter $newsletter)
    {
        $data = $request->validated();

        // dd($data['newsletter_file_path']);
        $image = $data['newsletter_thumbnail_image_path'];
        $pdfFile = $data['newsletter_file_path'];

        if ($image) {
            // Delete the old image file if a new one is uploaded
            if ($newsletter->newsletter_thumbnail_image_path) {
                Storage::disk('public')->delete($newsletter->newsletter_thumbnail_image_path);
            }
            // Store the new image directly under the 'newsletter/' directory
            $data['newsletter_thumbnail_image_path'] = $image->store('newsletter-thumbnail', 'public');
        } else {
            // If no new image is uploaded, keep the existing image
            $data['newsletter_thumbnail_image_path'] = $newsletter->newsletter_thumbnail_image_path;
        }

        if ($pdfFile) {
            // Delete the old pdfFile file if a new one is uploaded
            if ($newsletter->newsletter_file_path) {
                Storage::disk('public')->delete($newsletter->newsletter_file_path);
            }
            // Store the new pdfFile directly under the 'newsletter/' directory
            $data['newsletter_file_path'] = $pdfFile->store('newsletter-file', 'public');
        } else {
            // If no new pdfFile is uploaded, keep the existing pdfFile
            $data['newsletter_file_path'] = $newsletter->newsletter_file_path;
        }

        if ($data['status'] === 'revision') {
            $data['revision_at'] = now();
            $data['revision_by'] = Auth::user()->id;
        }

        if ($data['status'] === 'approved') {
            $data['approved_at'] = now();
            $data['approved_by'] = Auth::user()->id;
        }


        $newsletter->update($data);

        if ($data['status'] === 'revision') {
            return to_route('newsletter.index')->with(['access' => 'Newsletter needed revision.']);
        }

        if ($data['status'] === 'approved') {
            return to_route('newsletter.index')->with(['access' => 'Newsletter approved successfully.']);
        }

        return to_route('newsletter.index')->with(['success' => 'Newsletter Updated Successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Newsletter $newsletter)
    {
        $newsletter->delete();

        if ($newsletter->newsletter_thumbnail_image_path) {
            // Delete the specific old image file
            Storage::disk('public')->delete($newsletter->newsletter_thumbnail_image_path);
        }

        if ($newsletter->newsletter_thumbnail_image_path) {
            // Delete the specific old  file
            Storage::disk('public')->delete($newsletter->newsletter_thumbnail_image_path);
        }


        return to_route('newsletter.index')->with(['success' => 'Deleted Successfully']);
    }

    public function distributeIndex($id)
    {
        $newsletter = Newsletter::findOrFail($id);

        if(!$newsletter){
            return to_route('newsletter.index')->with(['error' => 'Article not Found']);
        }

        return inertia('Admin/Newsletter/Distribute', [
            'newsletter' => new NewsletterResource($newsletter),
        ]);
    }

    public function distributeNewsletter(Request $request, Newsletter $newsletter)
    {
        // dd($newsletter);
        // Validate the message and password
        $request->validate([
            'message' => 'required|string',
            'password' => 'required|string',
        ]);

        // Verify the authenticated user's password
        if (!Hash::check($request->password, Auth::user()->password)) {
            return redirect()->back()->withErrors(['password' => 'Incorrect password.']);
        }

        // Check if the newsletter status is approved
        if ($newsletter->status !== 'approved' && $newsletter->status !== 'distributed') {
            return to_route('newsletter.index')->with(['error' => 'Newsletter has not been approved for distribution.']);
        }

        $newsletter->update(['status' => 'distributed']);
        $newsletter->update(['distributed_at' => now()]);
        $newsletter->update(['distributed_by' => Auth::user()->id]);


        //old version
         // Get all user emails
        // $users = User::pluck('email');

        // // Queue each email
        // foreach ($users as $email) {
        //     SendNewsletterEmail::dispatch($email, $newsletter, $request->message);
        // }

        //new version

        $customMessage = $request->message;

        $newsletterDetails = [
            'id' => $newsletter->id,
            'description' => $newsletter->description, 
            'newsletter_file_path' => $newsletter->newsletter_file_path, 
        ];


        $users = User::whereNotNull('email_verified_at')->get();

        Notification::send($users, new NewsletterNotification($newsletterDetails, $customMessage));

        return to_route('newsletter.index')->with(['success' => 'Newsletter queued successfully. Distribution will begin shortly.']);
    }

    public function jobIndex()
    {
        // $jobs = Job::all(); // Fetch jobs from the default `jobs` table
        $query = Job::query();
        $jobs = $query->orderBy('id', 'asc')->paginate(10)->onEachSide(1);
        // dd($jobs);
        return inertia('Admin/Newsletter/Jobs', [
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

        return inertia('Admin/Newsletter/Article', [
            'articles' => ArticleResource::collection($articles),
            'categories' => CategoryResource::collection($categories),
            'academicYears' => AcademicYearResource::collection($academicYears),
            'queryParams' => request()->query() ? : null,
        ]);
    }

    public function articleShow($id)
    {
        $article = Article::findOrFail($id);

        if(!$article){
            return to_route('newsletter.articles')->with(['error' => 'Article not Found']);
        }

        return inertia('Admin/Newsletter/Show', [
            'article' => new ArticleResource($article),
        ]);
    }


    public function addArticle($id)
    {
        $article = Article::findOrFail($id);

        if(!$article){
            return to_route('newsletter.articles')->with(['error' => 'Article not Found']);
        }

        $article->update(['is_newsletter' => 'yes']);

        return to_route('newsletter.articles')->with(['success' => 'Article is added to Newsletter']);
    }
    public function removeArticle($id)
    {
        $article = Article::findOrFail($id);

        if(!$article){
            return to_route('newsletter.articles')->with(['error' => 'Article not Found']);
        }

        $article->update(['is_newsletter' => 'no']);

        return to_route('newsletter.articles')->with(['success' => 'Article is remove to Newsletter']);
    }

    public function calendar()
    {
        $newsletters = Newsletter::where('status', 'distributed')
                            ->whereNotNull('distributed_at')
                            ->get(['id','description', 'distributed_at' ,'status',]);

        // dd($newsletters);
        // Render the calendar page with newsletter passed as props
        return inertia('Admin/Newsletter/MyCalendar', [
            'newsletters' => $newsletters,
        ]);
    }
}