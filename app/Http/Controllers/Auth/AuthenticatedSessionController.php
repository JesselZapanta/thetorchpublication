<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(RouteServiceProvider::HOME);

        
        // //todo  change all the dashboard route to a controller -- done
        //  // Redirect to the dashboard based on the user's role
        // if ($request->user()->role === 'admin') {
        //     return redirect()->route('admin.dashboard');
        // } elseif ($request->user()->role === 'student') {
        //     return redirect()->route('student.dashboard');
        // }elseif ($request->user()->role === 'student_contributor') {
        //     return redirect()->route('student.dashboard');
        // }elseif ($request->user()->role === 'editor') {
        //     return redirect()->route('editor.dashboard');
        // } elseif ($request->user()->role === 'writer') {
        //     return redirect()->route('writer.dashboard');
        // }elseif ($request->user()->role === 'designer') {
        //     return redirect()->route('designer.dashboard');
        // }
        
        // // Optionally, handle other roles or provide a default redirect
        // return redirect()->route('login')->with('error', 'Invalid credentials.');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();
        
        return redirect('/');
    }
}
