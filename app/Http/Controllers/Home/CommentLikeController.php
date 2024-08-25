<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\CommentLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentLikeController extends Controller
{
    public function toggleLike(Comment $comment)
    {
        $user = Auth::user();
        
        // Check if the user has already liked this comment
        $existingLike = CommentLike::where('comment_id', $comment->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingLike) {
            // If the user has already liked this comment, toggle it off
            if ($existingLike->is_like) {
                $existingLike->delete();
            } else {
                // If the user has disliked it, change to like
                $existingLike->update(['is_like' => true]);
            }
        } else {
            // Otherwise, create a new like
            CommentLike::create([
                'comment_id' => $comment->id,
                'user_id' => $user->id,
                'is_like' => true,
            ]);
        }

        return back();
    }

    public function toggleDislike(Comment $comment)
    {
        $user = Auth::user();

        // Check if the user has already disliked this comment
        $existingDislike = CommentLike::where('comment_id', $comment->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingDislike) {
            // If the user has already disliked this comment, toggle it off
            if (!$existingDislike->is_like) {
                $existingDislike->delete();
            } else {
                // If the user has liked it, change to dislike
                $existingDislike->update(['is_like' => false]);
            }
        } else {
            // Otherwise, create a new dislike
            CommentLike::create([
                'comment_id' => $comment->id,
                'user_id' => $user->id,
                'is_like' => false,
            ]);
        }

        return back();
    }
}
