<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user(); // Get the currently authenticated user
        $data = $request->validated();
        
        // Check if a new profile image has been uploaded
        if ($request->hasFile('profile_image_path')) {
            // Delete the old profile image if a new one is uploaded
            if ($user->profile_image_path) {
                Storage::disk('public')->delete($user->profile_image_path);
            }
            // Store the new profile image directly under the 'profile/' directory and save its path
            $data['profile_image_path'] = $request->file('profile_image_path')
                ->store('profile', 'public');
        } else {
            // If no new image is uploaded, keep the existing image
            $data['profile_image_path'] = $user->profile_image_path;
        }



        // If the email has been updated, reset email verification status
        if ($user->email !== $request->input('email')) {
            // Reset email verification status
            $user->email_verified_at = null;
        }

        // Update the user with the validated data
        $user->update($data);

        return Redirect::route('profile.edit')->with('success', 'Profile updated successfully.');
    }


    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        //todo delete images

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
