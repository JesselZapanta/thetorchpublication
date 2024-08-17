<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\WordResource;
use App\Models\Word;
use App\Http\Requests\StoreWordRequest;
use App\Http\Requests\UpdateWordRequest;

class AdminWordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Word::query();

        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');
        
        
        if(request('name')){
            $query->where('name', 'like', '%'. request('name') . '%');
        }

        if(request('created_at')){
            $query->where('created_at', 'like', '%'. request('created_at') . '%');
        }

        if(request('updated_at')){
            $query->where('updated_at', 'like', '%'. request('updated_at') . '%');
        }

        $words = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        return inertia('Admin/Word/Index', [
            'words' => WordResource::collection($words),
            'queryParams' => request()->query() ? : null,
            'success' => session('success'),
            'delete_success' => session('delete_success'),
            'delete_error' => session('delete_error'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // return inertia('Admin/Word/Index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWordRequest $request)
    {
        $data = $request->validated();
        
        Word::create($data);

        return to_route('word.index')->with('success', 'Word is Added Succssfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Word $word)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Word $word)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWordRequest $request, Word $word)
    {
        $data = $request->validated();
        
        $word->update($data);

        return to_route('word.index')->with('success', 'Word is Updated Succssfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Word $word)
    {
        // Delete the Word
        $word->delete();

        return to_route('word.index')->with('delete_success', 'Deleted Successfully');
    }
}
