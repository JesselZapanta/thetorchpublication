<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFreedomWallRequest;
use App\Http\Requests\UpdateFreedomWallRequest;
use App\Http\Resources\FreedomWallResource;
use App\Models\AcademicYear;
use App\Models\FreedomWall;
use App\Models\Word;
use App\Utilities\AhoCorasick;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentFreedomWallController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $entries = Article::all();
        $query = FreedomWall::query();
        $id =  Auth::user()->id;

        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');
        
        
        if(request('body')){
            $query->where('body', 'like', '%'. request('body') . '%');
        }
        

        if(request('emotion')){
            $query->where('emotion', request('emotion'));
        }


        $entries = $query->where('user_id', $id)
                            ->where('visibility', 'visible')
                            ->orderBy($sortField, $sortDirection)
                            ->paginate(10)
                            ->onEachSide(1);

        return inertia('Student/FreedomWall/Index', [
            'entries' => FreedomWallResource::collection($entries),
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
    public function store(StoreFreedomWallRequest $request)
    {
        // dd($request);
        $data = $request->validated();

        // Check for entry limitation (one entry per day
        $existingEntry = FreedomWall::where('user_id', auth()->id())
                            ->where('created_at', '>=', now('Asia/Manila')->subDay()) // Check entries within the last 24 hours
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

        return to_route('student-freedomwall.index')->with(['success' => 'Entry submitted successfully.']);
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
    public function update(UpdateFreedomWallRequest $request, $id)
    {
        $freedomWall = FreedomWall::find($id);
        

        // dd($freedomWall);

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
            $errors['body'] = 'The message body contains inappropriate content: ' . implode(', ', $detectedWords);
        }

        // If there are any errors, return them
        if (!empty($errors)) {
            return redirect()->back()->withErrors($errors);
        }

        $data['user_id'] = auth()->id();

        // FreedomWall::create($data);
        $freedomWall->update($data);

        return to_route('student-freedomwall.index')->with(['success' => 'Freedom wall updated successfully.']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $freedomWall = FreedomWall::find($id); // Use find instead of findOrFail

        // if(!$freedomWall){
        //     return to_route('student-freedomwall.index')->with(['error' => 'Freedom wall not found.']);
        // }

        // $freedomWall->delete();

        // return to_route('student-freedomwall.index')->with(['success' => 'Deleted successfully.']);

        if(!$freedomWall){
            return back()->with('error', 'FreedomWall not found');
        }

        $freedomWall->update(['archive_by' => Auth::user()->id ]);
        $freedomWall->update(['visibility' => 'hidden']);

        return to_route('student-freedomwall.index')->with(['success' => 'Archive successfully.']);
    }
}
