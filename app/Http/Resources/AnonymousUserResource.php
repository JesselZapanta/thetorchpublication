<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class AnonymousUserResource extends JsonResource
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
            'student_id' => 100001,
            'username' => 'Anonymous',
            'name' => 'Anonymous',
            'email' => 'anonymous@gmail.com',
            // 'profile_image_path' => $this->profile_image_path ? Storage::url($this->profile_image_path) : '',
            'profile_image_path' => '/images/default/profile.jpg',
        ];
    }
}
