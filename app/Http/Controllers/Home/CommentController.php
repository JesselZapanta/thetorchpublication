<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Article;
use App\Models\Comment;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Models\Word;
use App\Utilities\AhoCorasick;
use Auth;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StoreCommentRequest $request)
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

        // Check if the message body contains any bad words
        $detectedWords = $ahoCorasick->search(strtolower($data['body']));
        if (!empty($detectedWords)) {
            $errors['body'] = 'The comment contains inappropriate content: ' . implode(', ', $detectedWords);
        }

        // If there are any errors, return them
        if (!empty($errors)) {
            return redirect()->back()->withErrors($errors);
        }

        $data['user_id'] = auth()->id();

        $activeAy = AcademicYear::where('status', 'active')->first();

        if (!$activeAy) {
            $activeAy = AcademicYear::orderBy('created_at', 'desc')->first();
        }

        $data['academic_year_id'] = $activeAy->id;

        
        Comment::create($data);

        // return back()->with(['success' => 'Comment is Added Successfully']);
        return back();
        // todo, redirect to the read article route
    }

    /**
     * Display the specified resource.
     */
    public function show(Comment $comment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Comment $comment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCommentRequest $request, Comment $comment)
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

         // Check if the article body contains any bad words
        $detectedWords = $ahoCorasick->search(strtolower($data['body']));
        if (!empty($detectedWords)) {
            $errors['body'] = 'The comment body contains inappropriate content: ' . implode(', ', $detectedWords);
        }


         // If there are any errors, return them
        if (!empty($errors)) {
            return redirect()->back()->withErrors($errors);
        }


        $data['user_id'] = auth()->id();
        
        $comment->update($data);

        // return back()->with(['success' => 'Comment is Updated Successfully']);
        return back();
          // todo, redirect to the read article route
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        // dd($comment);
        $comment->delete();

        // return back()->with(['success' => 'Comment is Deleted Successfully']);
        return back();
    }

    public function hide($id)
    {
        // dd($id);
        $comment = Comment::find($id); // Use find instead of findOrFail

        if(!$comment){
            return back()->with(['error' =>'Comment Not Found']);
        }

        $comment->update(['visibility' => 'hidden']);
        $comment->update(['archive_by' => Auth::user()->id ]);

        // return back()->with(['success' => 'Archive Successfully']);
        return back();
    }
}
