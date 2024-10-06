<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

class NewsletterResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'academic_year_id' => $this->academic_year_id,
            'description' => $this->description,
            'newsletter_thumbnail_image_path' => $this->newsletter_thumbnail_image_path ? Storage::url($this->newsletter_thumbnail_image_path) : '/images/default/newsletter.jpg',
            'newsletter_file_path' => $this->newsletter_file_path ? Storage::url($this->newsletter_file_path) : '',
            'status' => $this->status,
    
            'submitted_at' => $this->submitted_at ? (new Carbon($this->submitted_at))->format('F j, Y') : null,//Y-m-d
            'layoutBy' => $this->layoutBy ? new UserResource($this->layoutBy) : null,//tanan naay null kay mo error
            
            'revisionBy' => $this->revisionBy ? new UserResource($this->revisionBy) : null,
            'revision_at' => $this->revision_at ? (new Carbon($this->revision_at))->format('F j, Y') : null,
            'revision_message' => $this->revision_message,

            'approved_at' => $this->approved_at ? (new Carbon($this->approved_at))->format('F j, Y') : null,
            'approvedBy' => $this->approvedBy ? new UserResource($this->approvedBy) : null,
            
            'distributed_at' =>  $this->distributed_at ? (new Carbon($this->distributed_at))->format('F j, Y') : null,
            'distributedBy' => $this->distributedBy ? new UserResource($this->distributedBy) : null,
            
            'visibility' => $this->visibility,
        ];
    }
}
