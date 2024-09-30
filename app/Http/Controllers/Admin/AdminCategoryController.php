<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Article;
use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $categories = Category::all();

        $query = Category::query();

        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');
        
        
        if(request('name')){
            $query->where('name', 'like', '%'. request('name') . '%');
        }

        if(request('status')){
            $query->where('status', request('status'));
        }

        $categories = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        return inertia('Admin/Category/Index', [
            'categories' => CategoryResource::collection($categories),
            'queryParams' => request()->query() ? : null,
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
    public function store(StoreCategoryRequest $request)
    {
        $data = $request->validated();
        $image = $data['category_image_path'];

        // $data['name']=strtoupper($data['name']);

        if ($image) {
            // Store the image directly under the 'category/' directory and save its path
            $data['category_image_path'] = $image->store('category', 'public');
        }

        
        Category::create($data);

        return to_route('category.index')->with(['success' => 'Category Created Succssfully']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {

        $articlesCount = Article::where('category_id', $category->id)
                                ->where('status', 'published')
                                ->count();

        return inertia('Admin/Category/Show', [
            'category' => new CategoryResource($category),
            'articlesCount' => $articlesCount
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $data = $request->validated();

        $data['name']=strtoupper($data['name']);

        $image = $data['category_image_path'];

        if ($image) {
            // Delete the old image file if a new one is uploaded
            if ($category->category_image_path) {
                Storage::disk('public')->delete($category->category_image_path);
            }
            // Store the new image directly under the 'category/' directory
            $data['category_image_path'] = $image->store('category', 'public');
        } else {
            // If no new image is uploaded, keep the existing image
            $data['category_image_path'] = $category->category_image_path;
        }


        $category->update($data);

        return to_route('category.index')->with(['success' => 'Edited Successfuly']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        // Check if the category has any associated articles
        if ($category->articles()->exists()) {
            return to_route('category.index')->with(['error' => 'Unable to delete category because it has associated articles.']);
        }

        // Delete the category image if it exists
        if($category->category_image_path) {
            Storage::disk('public')->delete($category->category_image_path);
        }

        // Delete the category
        $category->delete();

        return to_route('category.index')->with(['success' => 'Deleted Successfully']);
    }
}
