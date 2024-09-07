<?php

namespace App\Http\Controllers\Writer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class WriterDashboardController extends Controller
{
    public function index(){
        return inertia('Writer/Dashboard');
    }
}
