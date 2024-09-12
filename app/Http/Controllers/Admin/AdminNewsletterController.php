<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AcademicYearResource;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\JobResource;
use App\Http\Resources\NewsletterResource;
use App\Jobs\SendNewsletterEmail;
use App\Mail\NewsletterMail;
use App\Models\AcademicYear;
use App\Models\Article;
use App\Models\Category;
use App\Models\Job;
use App\Models\Newsletter;
use App\Http\Requests\StoreNewsletterRequest;
use App\Http\Requests\UpdateNewsletterRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Bus;


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

        $newsletters = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        // $activeAy = AcademicYear::where('status', 'active')->first();//for non admin
        $activeAy = AcademicYear::all();//for admin

        if (!$activeAy) {
            $activeAy = AcademicYear::orderBy('created_at', 'desc')->first();
        }


        return inertia('Admin/Newsletter/Index', [
            'newsletters' => NewsletterResource::collection($newsletters),
            'queryParams' => request()->query() ? : null,
            // 'activeAy' => new AcademicYearResource($activeAy),//for non admin
            'activeAy' => AcademicYearResource::collection($activeAy),//for admin
        ]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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

        Newsletter::create($data);

        return to_route('newsletter.index')->with('success', 'Newsletter submitted Successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Newsletter $newsletter)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Newsletter $newsletter)
    {
        //
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

        $newsletter->update($data);

        return to_route('newsletter.index')->with('success', 'Newsletter Updated Successfully');
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


        return to_route('newsletter.index')->with('success', 'Deleted Successfully');
    }

    public function distributeNewsletter(Request $request, Newsletter $newsletter)
    {
        // dd($request);
        // Validate the message and password
        $request->validate([
            'message' => 'required|string',
            'password' => 'required|string',
        ]);

        // Verify the authenticated user's password
        if (!Hash::check($request->password, Auth::user()->password)) {
            return redirect()->back()->withErrors(['password' => 'Incorrect password.']);
        }

         // Get all user emails
        $users = User::pluck('email');

        // Queue each email
        foreach ($users as $email) {
            SendNewsletterEmail::dispatch($email, $newsletter, $request->message);
        }

        return redirect()->back()->with('success', 'Newsletter has been sent to all users.');
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
                        ->where('status', 'published')
                        ->where('visibility', 'visible')
                        ->paginate(10)
                        ->onEachSide(1);

        return inertia('Admin/Newsletter/Article', [
            'articles' => ArticleResource::collection($articles),
            'categories' => CategoryResource::collection($categories),
            'academicYears' => AcademicYearResource::collection($academicYears),
            'queryParams' => request()->query() ? : null,
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

}