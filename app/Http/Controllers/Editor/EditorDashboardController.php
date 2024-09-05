<?php

namespace App\Http\Controllers\Editor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EditorDashboardController extends Controller
{
    public function index(){
        return inertia('Editor/Dashboard');
    }
}
