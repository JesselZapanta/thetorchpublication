<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Models\FreedomWall;
use App\Http\Requests\StoreFreedomWallRequest;
use App\Http\Requests\UpdateFreedomWallRequest;

class FreedomWallController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch active categories
        $categories = Category::where('status', 'active')->limit(10)->get();
        return inertia('FreedomWall/Index', [
            'categories' => CategoryResource::collection($categories),
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
    public function store(StoreFreedomWallRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(FreedomWall $freedomWall)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FreedomWall $freedomWall)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFreedomWallRequest $request, FreedomWall $freedomWall)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FreedomWall $freedomWall)
    {
        //
    }
}
