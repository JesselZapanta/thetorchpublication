<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Validate the incoming request data
        $data = $request->validate([
            'student_id' => 'required|integer',
            'username' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'profile_image_path' => ['required', 'image', 'mimes:jpeg,png,jpg'],
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Handle the profile image upload
        if ($request->hasFile('profile_image_path')) {
            $data['profile_image_path'] = $request->file('profile_image_path')->store('profile/' . Str::random(10), 'public');
        }
        
        // Create the user with the validated data
        $user = User::create($data);

        // Fire the Registered event
        event(new Registered($user));

        // Log in the newly created user
        Auth::login($user);


        return redirect(RouteServiceProvider::HOME);

        // Redirect to the dashboard
        // return redirect(route('student.dashboard'));//todo change all the dashboard route to a controller

    }
}
