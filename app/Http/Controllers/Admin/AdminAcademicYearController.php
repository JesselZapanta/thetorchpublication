<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AcademicYearResource;
use App\Models\AcademicYear;
use App\Http\Requests\StoreAcademicYearRequest;
use App\Http\Requests\UpdateAcademicYearRequest;

class AdminAcademicYearController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $academicYears = AcademicYear::paginate(10);
        $query = AcademicYear::query();

        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'asc');
        
        if(request('description')){
            $query->where('description', 'like', '%'. request('description') . '%');
        }

        if(request('status')){
            $query->where('status', request('status'));
        }

        $academicYears = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        return inertia('Admin/AcademicYear/Index', [
            'academicYears' => AcademicYearResource::collection($academicYears),
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
    public function store(StoreAcademicYearRequest $request)
    {
        // dd($request);
        $data = $request->validated();

        if($data['status'] === 'active'){
            // Set all existing academic years' status to 'inactive'
            AcademicYear::query()->update(['status' => 'inactive']);
        }

        AcademicYear::create($data);

        return to_route('academic-year.index')->with(['success' => 'Academic Year is Added Succssfully']);
    }

    /**
     * Display the specified resource.
     */
    public function show(AcademicYear $academicYear)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AcademicYear $academicYear)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAcademicYearRequest $request, $id)
    {
        $academicYear = AcademicYear::find($id);

        if (!$academicYear) {
            return to_route('academic-year.index')->with(['error' => 'Academic Year is not found.']);
        }

        $data = $request->validated();

        // If the current academic year is active and we're not changing the status to inactive, just update other fields
        if ($academicYear->status === 'active' && $data['status'] !== 'inactive') {
            $academicYear->fill($data); // Fill other fields except status
            $academicYear->save(); // Save the changes
            return to_route('academic-year.index')->with(['success' => 'Academic Year is updated successfully.']);
        }

        // If we are changing the status to active, set all existing academic years' status to 'inactive'
        if ($data['status'] === 'active') {
            AcademicYear::query()->update(['status' => 'inactive']);
        }

        // Update the academic year with the new data, including status
        $academicYear->update($data);

        return to_route('academic-year.index')->with(['success' => 'Academic Year is updated successfully.']);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AcademicYear $academicYear)
    {
        // Check if the academicYear has any associated articles
        if ($academicYear->articles()->exists()) {
            return to_route('academic-year.index')->with(['error' => 'Unable to delete Academic Year because it has associated articles.']);
        }

        $academicYear->delete();

        return to_route('academic-year.index')->with(['success' => 'Academic Year Deleted Successfully']);
    }
}

