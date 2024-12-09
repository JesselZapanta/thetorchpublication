<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\FreedomWallResource;
use App\Models\AcademicYear;
use App\Models\Category;
use App\Models\FreedomWall;
use App\Http\Requests\StoreFreedomWallRequest;
use App\Http\Requests\UpdateFreedomWallRequest;
use App\Models\Word;
use App\Utilities\AhoCorasick;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FreedomWallController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        // Fetch active categories
        $categories = Category::where('status', 'active')->limit(5)->get();

        // Base query for FreedomWall entries
        $query = FreedomWall::query();

        // Apply default sorting by date descending
        $sort = $request->input('sort', 'date_desc');

        // Apply sorting based on the input or default
        switch ($sort) {
            case 'my':
                $query->where('user_id', Auth::user()->id);
                break;
            case 'date_asc':
                $query->orderBy('created_at', 'asc');
                break;
            case 'date_desc':
                $query->orderBy('created_at', 'desc');
                break;
            case 'body_asc':
                $query->orderBy('body', 'asc');
                break;
            case 'body_desc':
                $query->orderBy('body', 'desc');
                break;
            case 'likes_asc':
                $query->withCount(['likes as like_count'])
                    ->orderBy('like_count', 'asc');
                break;
            case 'likes_desc':
                $query->withCount(['likes as like_count'])
                    ->orderBy('like_count', 'desc');
                break;
            case 'dislikes_asc':
                $query->withCount(['dislikes as dislike_count'])
                    ->orderBy('dislike_count', 'asc');
                break;
            case 'dislikes_desc':
                $query->withCount(['dislikes as dislike_count'])
                    ->orderBy('dislike_count', 'desc');
                break;
        }

        // Apply sorting by emotion
        if ($request->has('emotionSort') && !empty($request->emotionSort)) {
            $query->where('emotion', $request->emotionSort);
        }

         // Apply search filter
        if ($request->has('search') && !empty($request->search)) {
            $query->where('body', 'like', "%{$request->search}%");
        }

        // Get the filtered results
        $freedomWallEntries = $query->where('visibility', 'visible')->paginate(15);
        // $freedomWallEntries = $query->get();

        return inertia('FreedomWall/Index', [
            'categories' => CategoryResource::collection($categories),
            'freedomWallEntries' => FreedomWallResource::collection($freedomWallEntries),
            'success' => session('success'),
            'error' => session('error'),
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

        // Check for entry limitation (one entry per day
        $existingEntry = FreedomWall::where('user_id', auth()->id())
                            ->where('created_at', '>=', now()->subDay()) // Check entries within the last 24 hours
                            ->first();

        if ($existingEntry) {
            return redirect()->back()->withErrors(['body' => 'You can only post one entry per day.']);
        }

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
            $errors['body'] = 'The message body contains inappropriate content: ' . implode(', ', $detectedWords);
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

        FreedomWall::create($data);

        return back()->with(['success' => 'Entry submitted successfully.']);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $freedomWall = FreedomWall::find($id);
        // Fetch active categories
        $categories = Category::where('status', 'active')->limit(5)->get();

        return inertia('FreedomWall/Show', [
            // 'freedomWall' => $freedomWall,
            'entry' => new FreedomWallResource($freedomWall),
            'categories' => CategoryResource::collection($categories),
            'success' => session('success'),
        ]);
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

        $data = $request->validated();

        //todo check entry limitation

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
            $errors['body'] = 'The message body contains inappropriate content: ' . implode(', ', $detectedWords);
        }

        // If there are any errors, return them
        if (!empty($errors)) {
            return redirect()->back()->withErrors($errors);
        }

        $data['user_id'] = auth()->id();

        // FreedomWall::create($data);
        $freedomWall->update($data);

        return back()->with('success', 'Freedom wall updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $freedomWall = FreedomWall::find($id); // Use find instead of findOrFail

        if(!$freedomWall){
            return to_route('freedom-wall.index')->with(['error' => 'Freedom wall not found.']);
        }

        $freedomWall->delete();
        return to_route('freedom-wall.index')->with(['success' => 'Deleted successfully.']);
    }

    public function hide($id)
    {
        $freedomWall = FreedomWall::find($id); // Use find instead of findOrFail

        if(!$freedomWall){
            return to_route('freedom-wall.index')->with(['error' => 'Freedom wall not found.']);
        }

        $freedomWall->update(['visibility' => 'hidden']);
        $freedomWall->update(['archive_by' => Auth::user()->id ]);

        return to_route('freedom-wall.index')->with(['success' => 'Archive successfully.']);
    }
}
