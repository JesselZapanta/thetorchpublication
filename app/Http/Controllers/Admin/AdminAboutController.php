<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMemberRequest;
use App\Http\Requests\UpdateMemberRequest;
use App\Http\Resources\MemberResource;
use App\Models\Member;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class AdminAboutController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $members = Member::all();

        $query = Member::query();

        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');
        
        
        if(request('name')){
            $query->where('name', 'like', '%'. request('name') . '%');
        }

        if(request('status')){
            $query->where('status', request('status'));
        }

        $members = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        return inertia('Admin/About/Index', [
            'members' => MemberResource::collection($members),
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
    public function store(StoreMemberRequest $request)
    {
        $data = $request->validated();
        $image = $data['member_image_path'];

        // $data['name']=strtoupper($data['name']);

        if ($image) {
            // Store the image directly under the 'members/' directory and save its path
            $data['member_image_path'] = $image->store('members', 'public');
        }

        
        Member::create($data);

        return to_route('about.index')->with(['success' => 'Member created succssfully.']);
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
    public function update(UpdateMemberRequest $request, string $id)
    {
        $member = Member::find($id);

        if(!$member) {
            return to_route('about.index')->with(['error' => 'Member not found.']);
        }

        $data = $request->validated();

        $image = $data['member_image_path'];

        if ($image) {
            // Delete the old image file if a new one is uploaded
            if ($member->member_image_path) {
                Storage::disk('public')->delete($member->member_image_path);
            }
            // Store the new image directly under the 'members/' directory
            $data['member_image_path'] = $image->store('members', 'public');
        } else {
            // If no new image is uploaded, keep the existing image
            $data['member_image_path'] = $member->member_image_path;
        }


        $member->update($data);

        return to_route('about.index')->with(['success' => 'Edited successfuly.']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $member = Member::find($id);

        if(!$member) {
            return to_route('about.index')->with(['error' => 'Member not found.']);
        }

        // Delete the member image if it exists
        if($member->member_image_path) {
            Storage::disk('public')->delete($member->member_image_path);
        }

        // Delete the member
        $member->delete();

        return to_route('about.index')->with(['success' => 'Deleted successfully.']);
    }
}
