<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AcademicYearResource;
use App\Http\Resources\NewsletterResource;
use App\Models\AcademicYear;
use App\Models\Newsletter;
use App\Http\Requests\StoreNewsletterRequest;
use App\Http\Requests\UpdateNewsletterRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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
        $file = $data['newsletter_file_path'];

        if ($image) {
            // Store the image directly under the 'newsletter-thumbnail/' directory and save its path
            $data['newsletter_thumbnail_image_path'] = $image->store('newsletter-thumbnail', 'public');
        }

        if ($file) {
            // Store the image directly under the 'newsletter-file/' directory and save its path
            $data['newsletter_file_path'] = $file->store('newsletter-file', 'public');
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
            $data['newsletter_file_path'] = $image->store('newsletter-file', 'public');
        } else {
            // If no new pdfFile is uploaded, keep the existing image
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

        if ($newsletter->newsletter_file_path) {
            // Delete the specific old  file
            Storage::disk('public')->delete($newsletter->newsletter_file_path);
        }


        return to_route('newsletter.index')->with('delete_success', 'Deleted Successfully');
    }
}
