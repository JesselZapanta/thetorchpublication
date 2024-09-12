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
            'description' => $this->description,
            'status' => $this->status,
            'newsletter_thumbnail_image_path' => $this->newsletter_thumbnail_image_path ? Storage::url($this->newsletter_thumbnail_image_path) : '/images/default/article.png',
            'newsletter_file_path' => $this->newsletter_file_path ? Storage::url($this->newsletter_file_path) : '',
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'updated_at' => (new Carbon($this->updated_at))->format('Y-m-d'),
            'academic_year_id' => $this->academic_year_id,
            'revision_message' => $this->revision_message,
        ];
    }
}
