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

            'author' => $this->author ?? '',
            'excerpt' => $this->excerpt,
            'slug' => $this->slug,

            'title' => $this->title,
            'body' => $this->body,
            
            'status' => $this->status,
            'revision_message' => $this->revision_message,

            'caption' => $this->caption,
            'views' => $this->views,

            'category' => new CategoryResource($this->category),
            'category_id' => $this->category_id,

            'published_date' => $this->published_date ? (new Carbon($this->published_date))->format('Y-m-d') : 'Not Published',

            
            'academic_year_id' => $this->academic_year_id,

            'createdBy' => new UserResource($this->createdBy),
            'editedBy' => new UserResource($this->editedBy),
            'layoutBy' => new UserResource($this->layoutBy),

            'article_image_path' => $this->article_image_path ? Storage::url($this->article_image_path) : '/images/default/article.png',
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),

            'is_anonymous' => $this->is_anonymous,
            'is_featured' => $this->is_anonymous,
        ];
    }
}
