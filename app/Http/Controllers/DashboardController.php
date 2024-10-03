<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function dashboard()
    {
        if(Auth::check()){
            $role = Auth::user()->role;

            if ( $role === 'admin') {
                return redirect()->route('admin.dashboard');
            } elseif ( $role === 'student') {
                return redirect()->route('student.dashboard');
            }elseif ( $role === 'student_contributor') {
                return redirect()->route('student.dashboard');
            }elseif ( $role === 'editor') {
                return redirect()->route('editor.dashboard');
            } elseif ( $role === 'writer') {
                return redirect()->route('writer.dashboard');
            }elseif ( $role === 'designer') {
                return redirect()->route('designer.dashboard');
            }
        }else{
            return redirect()->route('login');
        }
    }
}
