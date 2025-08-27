<?php

namespace App\Http\Controllers\Designer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Designer\DesignerStorePublicationRequest;
use App\Http\Requests\Designer\DesignerUpdatePublicationRequest;
use App\Http\Requests\StoreNewsletterRequest;
use App\Http\Resources\AcademicYearResource;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\PublicationResource;
use App\Models\AcademicYear;
use App\Models\Article;
use App\Models\Category;
use App\Models\Publication;
use App\Models\Word;
use App\Utilities\AhoCorasick;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class DesignerPublicationController extends Controller
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

        $publications = $query->orderBy($sortField, $sortDirection)
                                ->where('visibility', 'visible')
                                ->where('layout_by', $id)
                                ->paginate(10)
                                ->onEachSide(1);

        return inertia('Designer/Publication/Index', [
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
        return inertia('Designer/Publication/Create', [
            'activeAy' => AcademicYearResource::collection($activeAy),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(DesignerStorePublicationRequest $request)
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

        $activeAy = AcademicYear::where('status', 'active')->first();

        if (!$activeAy) {
            $activeAy = AcademicYear::orderBy('created_at', 'desc')->first();
        }


        $data['layout_by'] = Auth::user()->id;
        $data['submitted_at'] = now('Asia/Manila');
        $data['status'] = 'pending';
        $data['academic_year_id'] = $activeAy->id;


        Publication::create($data);

        return to_route('designer-publication.index')->with(['success' => 'Publication submitted successfully.']);
    }


    public function timeLine($id)
    {
        $publication = Publication::find($id);

        return inertia('Designer/Publication/Timeline', [
            'publication' => new PublicationResource($publication),
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Publication $designer_publication)
    {
        return inertia('Designer/Publication/Edit', [
            'publication' => new PublicationResource($designer_publication)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(DesignerUpdatePublicationRequest $request, Publication $designer_publication)
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
            if ($designer_publication->publication_thumbnail_image_path) {
                Storage::disk('public')->delete($designer_publication->publication_thumbnail_image_path);
            }
            // Store the new image directly under the 'publication/' directory
            $data['publication_thumbnail_image_path'] = $image->store('publication-thumbnail', 'public');
        } else {
            // If no new image is uploaded, keep the existing image
            $data['publication_thumbnail_image_path'] = $designer_publication->publication_thumbnail_image_path;
        }

        if ($pdfFile) {
            // Delete the old pdfFile file if a new one is uploaded
            if ($designer_publication->publication_file_path) {
                Storage::disk('public')->delete($designer_publication->publication_file_path);
            }
            // Store the new pdfFile directly under the 'publication/' directory
            $data['publication_file_path'] = $pdfFile->store('publication-file', 'public');
        } else {
            // If no new pdfFile is uploaded, keep the existing pdfFile
            $data['publication_file_path'] = $designer_publication->publication_file_path;
        }

        $data['status'] = 'pending';

        $designer_publication->update($data);

        return to_route('designer-publication.index')->with(['success' => 'Publication Updated successfully.']);
    }

    /**
     * Remove the specified resource from storage.
     */

    //  archive instead of delte
    public function destroy($id)
    {
        // $publication = Publication::find($id);
        // if(!$publication){
        //     return to_route('designer-publication.index')->with(['error' => 'Publication not found']);
        // }
        // $publication->delete();

        // if ($publication->publication_thumbnail_image_path) {
        //     // Delete the specific old image file
        //     Storage::disk('public')->delete($publication->publication_thumbnail_image_path);
        // }

        // if ($publication->publication_thumbnail_image_path) {
        //     // Delete the specific old  file
        //     Storage::disk('public')->delete($publication->publication_thumbnail_image_path);
        // }

        $publication = Publication::find($id);

        // dd($publication);

        if(!$publication){
            return back()->with('error', 'Publication not found.');
        }

        $publication->update(['visibility' => 'hidden']);
        $publication->update(['archive_by' => Auth::user()->id ]);

        return to_route('designer-publication.index')->with(['success' => 'Archive successfully.']);
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

        return inertia('Designer/Publication/Article', [
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
                            ->orWhere('is_newsletter', 'added');  // Publication conditions
                    })
                    ->where('visibility', 'visible')  // Only visible articles
                    ->firstOrFail();


        if(!$article){
            return to_route('publication.articles')->with(['error' => 'Article not Found']);
        }

        return inertia('Designer/Publication/Show', [
            'article' => new ArticleResource($article),
        ]);
    }


    public function notLayout($id)
    {
        $article = Article::findOrFail($id);

        if(!$article){
            return to_route('publication.articles')->with(['error' => 'Article not Found']);
        }

        $article->update(['is_newsletter' => 'yes']);

        return to_route('designer-publication.articles')->with('success', 'The article has not been laid out yet.');
    }

    public function isLayout($id)
    {
        $article = Article::findOrFail($id);

        if(!$article){
            return to_route('publication.articles')->with(['error' => 'Article not Found']);
        }

        $article->update(['is_newsletter' => 'added']);

        return to_route('designer-publication.articles')->with(['success' => 'The article has been successfully laid out in the publication.']);
    }

    public function calendar()
    {
        $publications = Publication::where('status', 'distributed')
                            ->where('visibility', 'visible')
                            ->whereNotNull('distributed_at')
                            ->get(['id','description', 'distributed_at' ,'status',]);

        // dd($publications);
        // Render the calendar page with publication passed as props
        return inertia('Designer/Publication/MyCalendar', [
            'publications' => $publications,
        ]);
    }
    
}



