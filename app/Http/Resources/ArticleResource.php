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
        // Calculate average rating
        $averageRating = $this->ratings->avg('rating');

        return[
            'id' => $this->id,

            'author' => $this->author ?? '',
            'excerpt' => $this->excerpt,
            'slug' => $this->slug,

            'title' => $this->title,
            'body' => $this->body,
            
            'status' => $this->status,
            'revision_message' => $this->revision_message,
            'rejection_message' => $this->rejection_message,

            'caption' => $this->caption,
            'views' => $this->views,

            'category' => new CategoryResource($this->category),
            'category_id' => $this->category_id,

            // 'published_date' => $this->published_date ? (new Carbon($this->published_date))->format('Y-m-d') : null,

            'submitted_at' => $this->submitted_at ? (new Carbon ($this->submitted_at))->format('F j, Y') : null,
            'rejected_at' => $this->rejected_at ? (new Carbon ($this->rejected_at))->format('F j, Y') : null,
            'edited_at' => $this->edited_at ? (new Carbon ($this->edited_at))->format('F j, Y') : null,
            'revision_at' => $this->revision_at ? (new Carbon ($this->revision_at))->format('F j, Y') : null,
            'published_date' => $this->published_date ? (new Carbon ($this->published_date))->format('F j, Y') : null,//for form
            'publishedDate' => $this->published_date ? (new Carbon ($this->published_date))->format('Y-m-d') : null,
            
            'academic_year_id' => $this->academic_year_id,

            'createdBy' => $this->createdBy ? new UserResource($this->createdBy) : null ,
            'editedBy' => $this->editedBy ? new UserResource($this->editedBy) : null ,
            'layoutBy' => $this->layoutBy ? new UserResource($this->layoutBy) : null ,
            'revisionBy' => $this->revisionBy ? new UserResource($this->revisionBy) : null ,
            'publishedBy' => $this->publishedBy ? new UserResource($this->publishedBy) : null ,

            'article_image_path' => $this->article_image_path ? Storage::url($this->article_image_path) : '/images/default/article.png',
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),

            'is_anonymous' => $this->is_anonymous,
            'is_featured' => $this->is_featured,

            // 'average_rating' => $averageRating ? round($averageRating, 2) : null,
            'average_rating' => $averageRating ? round($averageRating) : 0,
            'report_count' => $this->report_count,
            'visibility' => $this->visibility,
            
            'is_newsletter' => $this->is_newsletter,
            'draft' => $this->draft,
        ];
    }
}
