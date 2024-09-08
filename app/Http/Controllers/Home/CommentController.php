<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Comment;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Models\Word;
use App\Utilities\AhoCorasick;

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

         // Build the Trie
        $badWords = Word::pluck('name')->toArray();//todo might change to word insted of name
        $ahoCorasick = new AhoCorasick();
        foreach ($badWords as $badWord) {
            $ahoCorasick->insert(strtolower($badWord));
        }
        
        $ahoCorasick->buildFailureLinks();

        // Check if the article body contains any bad words using Aho-Corasick
        if ($ahoCorasick->search(strtolower($data['body']))) {
            return redirect()->back()->withErrors(['body' => 'The comment contains inappropriate content.']);
        }

        $data['user_id'] = auth()->id();
        
        Comment::create($data);

        return back()->with('success', 'Comment is Added Successfully');
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

         // Build the Trie
        $badWords = Word::pluck('name')->toArray();//todo might change to word insted of name
        $ahoCorasick = new AhoCorasick();
        foreach ($badWords as $badWord) {
            $ahoCorasick->insert(strtolower($badWord));
        }
        
        $ahoCorasick->buildFailureLinks();

        // Check if the article body contains any bad words using Aho-Corasick
        if ($ahoCorasick->search(strtolower($data['body']))) {
            return redirect()->back()->withErrors(['body' => 'The comment contains inappropriate content.']);
        }

        $data['user_id'] = auth()->id();
        
        $comment->update($data);

        return back()->with('success', 'Comment is Updated Successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        // dd($comment);
        $comment->delete();

        return back()->with('success', 'Comment is Deleted Successfully');
    }

    public function hide($id)
    {
        // dd($id);
        $comment = Comment::find($id); // Use find instead of findOrFail

        if(!$comment){
            return back()->with('error', 'Comment Not Found');
        }

        $comment->update(['visibility' => 'hidden']);

        return back()->with('success', 'Soft Delete Successfully');
    }
}
