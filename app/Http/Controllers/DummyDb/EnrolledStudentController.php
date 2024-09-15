<?php

namespace App\Http\Controllers\DummyDb;

use App\Http\Controllers\Controller;
use App\Models\EnrolledStudent;
use Illuminate\Support\Facades\Validator;

class EnrolledStudentController extends Controller
{
    public function validateStudent($student_id)
    {
        // Assuming you have a Student model and a method to check if the student exists
        $studentExists = EnrolledStudent::where('student_id', $student_id)->exists();

        // Return true if the student exists, otherwise false
        return response()->json($studentExists);
    }
}
