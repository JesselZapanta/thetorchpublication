<?php

namespace App\Http\Controllers\Designer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Designer\DesignerStoreNewsletterRequest;
use App\Http\Requests\StoreNewsletterRequest;
use App\Http\Resources\AcademicYearResource;
use App\Http\Resources\NewsletterResource;
use App\Models\AcademicYear;
use App\Models\Newsletter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
        $data['status'] = 'pending';
        $data['academic_year_id'] = $activeAy->id;

        Newsletter::create($data);

        return to_route('designer-newsletter.index')->with(['success' => 'Newsletter submitted Successfully']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
