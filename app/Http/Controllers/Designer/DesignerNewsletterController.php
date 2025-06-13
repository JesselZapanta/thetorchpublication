<?php

namespace App\Http\Controllers\Designer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Designer\DesignerStoreNewsletterRequest;
use App\Http\Requests\Designer\DesignerUpdateNewsletterRequest;
use App\Http\Requests\StoreNewsletterRequest;
use App\Http\Resources\AcademicYearResource;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\NewsletterResource;
use App\Models\AcademicYear;
use App\Models\Article;
use App\Models\Category;
use App\Models\Newsletter;
use App\Models\Word;
use App\Utilities\AhoCorasick;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class DesignerNewsletterController extends Controller
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
                                ->where('visibility', 'visible')
                                ->where('layout_by', $id)
                                ->paginate(10)
                                ->onEachSide(1);

        return inertia('Designer/Newsletter/Index', [
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
        return inertia('Designer/Newsletter/Create', [
            'activeAy' => AcademicYearResource::collection($activeAy),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(DesignerStoreNewsletterRequest $request)
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

        // Check if the article description contains any bad words
        $detectedWords = $ahoCorasick->search(strtolower($data['description']));
        if (!empty($detectedWords)) {
            $errors['description'] = 'The description contains inappropriate content: ' . implode(', ', $detectedWords);
        }

        // If there are any errors, return them
        if (!empty($errors)) {
            return redirect()->back()->withErrors($errors);
        }


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

        $activeAy = AcademicYear::where('status', 'active')->first();

        if (!$activeAy) {
            $activeAy = AcademicYear::orderBy('created_at', 'desc')->first();
        }


        $data['layout_by'] = Auth::user()->id;
        $data['submitted_at'] = now('Asia/Manila');
        $data['status'] = 'pending';
        $data['academic_year_id'] = $activeAy->id;


        Newsletter::create($data);

        return to_route('designer-newsletter.index')->with(['success' => 'Newsletter submitted successfully.']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    
    public function timeLine($id)
    {
        $newsletter = Newsletter::find($id);

        return inertia('Designer/Newsletter/Timeline', [
            'newsletter' => new NewsletterResource($newsletter),
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Newsletter $designer_newsletter)
    {
        return inertia('Designer/Newsletter/Edit', [
            'newsletter' => new NewsletterResource($designer_newsletter)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(DesignerUpdateNewsletterRequest $request, Newsletter $designer_newsletter)
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

        // dd($data['newsletter_file_path']);
        $image = $data['newsletter_thumbnail_image_path'];
        $pdfFile = $data['newsletter_file_path'];

        if ($image) {
            // Delete the old image file if a new one is uploaded
            if ($designer_newsletter->newsletter_thumbnail_image_path) {
                Storage::disk('public')->delete($designer_newsletter->newsletter_thumbnail_image_path);
            }
            // Store the new image directly under the 'newsletter/' directory
            $data['newsletter_thumbnail_image_path'] = $image->store('newsletter-thumbnail', 'public');
        } else {
            // If no new image is uploaded, keep the existing image
            $data['newsletter_thumbnail_image_path'] = $designer_newsletter->newsletter_thumbnail_image_path;
        }

        if ($pdfFile) {
            // Delete the old pdfFile file if a new one is uploaded
            if ($designer_newsletter->newsletter_file_path) {
                Storage::disk('public')->delete($designer_newsletter->newsletter_file_path);
            }
            // Store the new pdfFile directly under the 'newsletter/' directory
            $data['newsletter_file_path'] = $pdfFile->store('newsletter-file', 'public');
        } else {
            // If no new pdfFile is uploaded, keep the existing pdfFile
            $data['newsletter_file_path'] = $designer_newsletter->newsletter_file_path;
        }

        $data['status'] = 'pending';

        $designer_newsletter->update($data);

        return to_route('designer-newsletter.index')->with(['success' => 'Newsletter Updated successfully.']);
    }

    /**
     * Remove the specified resource from storage.
     */

    //  archive instead of delte
    public function destroy($id)
    {
        // $newsletter = Newsletter::find($id);
        // if(!$newsletter){
        //     return to_route('designer-newsletter.index')->with(['error' => 'Newsletter not found']);
        // }
        // $newsletter->delete();

        // if ($newsletter->newsletter_thumbnail_image_path) {
        //     // Delete the specific old image file
        //     Storage::disk('public')->delete($newsletter->newsletter_thumbnail_image_path);
        // }

        // if ($newsletter->newsletter_thumbnail_image_path) {
        //     // Delete the specific old  file
        //     Storage::disk('public')->delete($newsletter->newsletter_thumbnail_image_path);
        // }

        $newsletter = Newsletter::find($id);

        // dd($newsletter);

        if(!$newsletter){
            return back()->with('error', 'Newsletter not found.');
        }

        $newsletter->update(['visibility' => 'hidden']);
        $newsletter->update(['archive_by' => Auth::user()->id ]);

        return to_route('designer-newsletter.index')->with(['success' => 'Archive successfully.']);
    }

    public function SelectArticles()
    {
        $query = Article::query();
        $categories = Category::all();
        $academicYears = AcademicYear::all();

        $sortField = request('sort_field', 'is_newsletter');
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

    
        // Apply filters and ordering
        $articles = $query->where(function($query) {
            $query->where('status', 'published')
                ->where(function($query) {
                    $query->where('is_newsletter', 'yes')
                            ->orWhere('is_newsletter', 'added');
                })
                ->where('visibility', 'visible');
        })
        ->orderBy($sortField, $sortDirection)
        ->paginate(10)
        ->onEachSide(1);

        return inertia('Designer/Newsletter/Article', [
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
                    ->where(function ($query) {
                        $query->where('is_newsletter', 'yes')
                            ->orWhere('is_newsletter', 'added');  // Newsletter conditions
                    })
                    ->where('visibility', 'visible')  // Only visible articles
                    ->firstOrFail();


        if(!$article){
            return to_route('newsletter.articles')->with(['error' => 'Article not Found']);
        }

        return inertia('Designer/Newsletter/Show', [
            'article' => new ArticleResource($article),
        ]);
    }


    public function notLayout($id)
    {
        $article = Article::findOrFail($id);

        if(!$article){
            return to_route('newsletter.articles')->with(['error' => 'Article not Found']);
        }

        $article->update(['is_newsletter' => 'yes']);

        return to_route('designer-newsletter.articles')->with('success', 'The article has not been laid out yet.');
    }

    public function isLayout($id)
    {
        $article = Article::findOrFail($id);

        if(!$article){
            return to_route('newsletter.articles')->with(['error' => 'Article not Found']);
        }

        $article->update(['is_newsletter' => 'added']);

        return to_route('designer-newsletter.articles')->with(['success' => 'The article has been successfully laid out in the newsletter.']);
    }

    public function calendar()
    {
        $newsletters = Newsletter::where('status', 'distributed')
                            ->where('visibility', 'visible')
                            ->whereNotNull('distributed_at')
                            ->get(['id','description', 'distributed_at' ,'status',]);

        // dd($newsletters);
        // Render the calendar page with newsletter passed as props
        return inertia('Designer/Newsletter/MyCalendar', [
            'newsletters' => $newsletters,
        ]);
    }
    
}



