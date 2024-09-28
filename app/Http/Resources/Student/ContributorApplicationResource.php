<?php

namespace App\Http\Resources\Student;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ContributorApplicationResource extends JsonResource
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
            'applied_for' => $this->applied_for,
            'user_id' => $this->user_id,

            'user' => $this->user ? new UserResource($this->user) : null ,

            'institute' => $this->institute,
            'program' => $this->program,
            'status' => $this->status,
            'sample_work_file_path' => $this->sample_work_file_path ? Storage::url($this->sample_work_file_path) : "",
        ];
    }
}
