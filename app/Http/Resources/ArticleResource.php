<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ArticleResource extends JsonResource
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
            'title' => $this->title,
            'body' => $this->body,
            'status' => $this->status,
            'caption' => $this->caption,
            'views' => $this->views,
            'category' => new CategoryResource($this->category),
            'category_id' => $this->category_id,
            'createdBy' => new UserResource($this->createdBy),
            'article_image_path' => $this->article_image_path ? Storage::url($this->article_image_path) : '',
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
        ];
    }
}
