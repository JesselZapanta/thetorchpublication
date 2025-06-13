<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\FreedomWall;
use App\Models\FreedomWallLike;
use Illuminate\Support\Facades\Auth;

class FreedomWallLikeController extends Controller
{
    public function toggleLike(FreedomWall $entryId)
    {
        $user = Auth::user();

        $activeAy = AcademicYear::where('status', 'active')->first();

        if (!$activeAy) {
            $activeAy = AcademicYear::orderBy('created_at', 'desc')->first();
        }

        // $data['academic_year_id'] = $activeAy->id;
        
        // Check if the user has already liked this entryId
        $existingLike = FreedomWallLike::where('freedom_wall_id', $entryId->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingLike) {
            // If the user has already liked this entryId, toggle it off
            if ($existingLike->is_like) {
                $existingLike->delete();
            } else {
                // If the user has disliked it, change to like
                $existingLike->update(['is_like' => true]);
            }
        } else {
            // Otherwise, create a new like
            FreedomWallLike::create([
                'freedom_wall_id' => $entryId->id,
                'user_id' => $user->id,
                'academic_year_id' => $activeAy->id,
                'is_like' => true,
            ]);
        }

        return back();
    }

    public function toggleDislike(FreedomWall $entryId)
    {
        $user = Auth::user();
        
        $activeAy = AcademicYear::where('status', 'active')->first();

        if (!$activeAy) {
            $activeAy = AcademicYear::orderBy('created_at', 'desc')->first();
        }

        // $data['academic_year_id'] = $activeAy->id;

        // Check if the user has already disliked this entryId
        $existingDislike = FreedomWallLike::where('freedom_wall_id', $entryId->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingDislike) {
            // If the user has already disliked this entryId, toggle it off
            if (!$existingDislike->is_like) {
                $existingDislike->delete();
            } else {
                // If the user has liked it, change to dislike
                $existingDislike->update(['is_like' => false]);
            }
        } else {
            // Otherwise, create a new dislike
            FreedomWallLike::create([
                'freedom_wall_id' => $entryId->id,
                'user_id' => $user->id,
                'academic_year_id' => $activeAy->id,
                'is_like' => false,
            ]);
        }

        return back();
    }
}

