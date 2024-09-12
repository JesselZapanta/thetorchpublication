<?php

namespace App\Http\Controllers\Designer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DesignerDashboardController extends Controller
{
    public function index(){
        return inertia('Designer/Dashboard');
    }
}
