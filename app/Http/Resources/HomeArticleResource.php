<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class HomeArticleResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // // Calculate average rating
        // $averageRating = $this->ratings->avg('rating');

         // Check if the resource (article) exists
        if (!$this->resource) {
            return [];
        }

        // Calculate the average rating if ratings exist, otherwise return 0
        $averageRating = $this->ratings ? $this->ratings->avg('rating') : 0;

        return[
            'id' => $this->id,

            'author' => $this->author ?? '',
            'excerpt' => $this->excerpt,

            'title' => $this->title,
            'body' => $this->body,

            'caption' => $this->caption,
            'views' => $this->views->count(),

            'category' => new CategoryResource($this->category),
            'category_id' => $this->category_id,

            'academic_year_id' => $this->academic_year_id,
            'published_date' => $this->published_date ? (new Carbon ($this->published_date))->format('F j, Y') : null,//for form

            // 'createdBy' => $this->createdBy ? new UserResource($this->createdBy) : null ,
            'createdBy' => ($this->is_anonymous === 'yes') 
                ? new AnonymousUserResource($this->createdBy) 
                : ($this->createdBy ? new UserResource($this->createdBy) : null),


            'article_image_path' => $this->article_image_path ? Storage::url($this->article_image_path) : '/images/default/article.png',
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),

            'is_anonymous' => $this->is_anonymous,
            'is_featured' => $this->is_featured,
            
            'average_rating' => $averageRating ? round($averageRating) : 0,
            'report_count' => $this->report_count,

        ];
    }
}
