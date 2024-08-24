<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class CommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'body' => $this->body,
            'user_id' => $this->user_id,
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'commentedBy' => new UserResource($this->commentedBy), // Assuming you have a UserResource

            'likes_count' => $this->likes()->count(),
            'dislikes_count' => $this->dislikes()->count(),
            'user_has_liked' => $this->likes()->where('user_id', auth()->id())->exists(),
            'user_has_disliked' => $this->dislikes()->where('user_id', auth()->id())->exists(),
        ];
    }
}
