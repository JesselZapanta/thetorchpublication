<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return[
            'id' => $this->id,
            'student_id' => $this->student_id,
            'username' => $this->username,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'position' => $this->position,
            // 'profile_image_path' => $this->profile_image_path ? Storage::url($this->profile_image_path) : '',
            'profile_image_path' => $this->profile_image_path ? Storage::url($this->profile_image_path) : '/images/default/profile.jpg',
        ];
    }
}
