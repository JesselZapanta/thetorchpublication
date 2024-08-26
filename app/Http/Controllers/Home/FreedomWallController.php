<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\FreedomWallResource;
use App\Models\Category;
use App\Models\FreedomWall;
use App\Http\Requests\StoreFreedomWallRequest;
use App\Http\Requests\UpdateFreedomWallRequest;
use App\Models\Word;
use App\Utilities\AhoCorasick;

class FreedomWallController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch active categories
        $categories = Category::where('status', 'active')->limit(10)->get();

        //todo implement sorting
        $freedomWallEntries = FreedomWall::orderBy('created_at', 'DESC')->get();

        return inertia('FreedomWall/Index', [
            'categories' => CategoryResource::collection($categories),
            'freedomWallEntries' => FreedomWallResource::collection($freedomWallEntries),
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
        // dd($request);
        $data = $request->validated();

        //todo check entry limitation

         // Build the Trie
        $badWords = Word::pluck('name')->toArray();//todo might change to word insted of name
        $ahoCorasick = new AhoCorasick();
        foreach ($badWords as $badWord) {
            $ahoCorasick->insert(strtolower($badWord));
        }
        
        $ahoCorasick->buildFailureLinks();

        // Check if the article body contains any bad words using Aho-Corasick
        if ($ahoCorasick->search(strtolower($data['body']))) {
            return redirect()->back()->withErrors(['body' => 'The message contains inappropriate content.']);
        }

        $data['user_id'] = auth()->id();

        FreedomWall::create($data);

        return back()->with('success', 'Entry Submitted Successfully');
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
