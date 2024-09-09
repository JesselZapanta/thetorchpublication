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
        $sortDirection = request('sort_direction', 'desc');
        
        if(request('description')){
            $query->where('description', 'like', '%'. request('description') . '%');
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

        return to_route('academic-year.index')->with('success', 'Academic Year is Added Succssfully');
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
    public function update(UpdateAcademicYearRequest $request, AcademicYear $academicYear)
    {
        // dd($request);
        $data = $request->validated();

        if($data['status'] === 'active'){
            // Set all existing academic years' status to 'inactive'
            AcademicYear::query()->update(['status' => 'inactive']);
        }

        $academicYear->update($data);

        return to_route('academic-year.index')->with('success', 'Academic Year is Updated Succssfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AcademicYear $academicYear)
    {
        // Check if the academicYear has any associated articles
        if ($academicYear->articles()->exists()) {
            return to_route('academic-year.index')->with('error', 'Unable to delete Academic Year because it has associated articles.');
        }

        $academicYear->delete();
    }
}
