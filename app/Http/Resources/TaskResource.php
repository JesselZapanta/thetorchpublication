<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class TaskResource extends JsonResource
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
            'name' => $this->name,
            'description' => $this->description,
            'category_id' => $this->category_id,
            'academic_year_id' => $this->academic_year_id,
            'category' =>  new CategoryResource($this->category),

            'assignedBy' => $this->assignedBy ? new UserResource($this->assignedBy) : null,//for the forin ID/ display table/in model

            'layoutBy' => $this->layoutBy ? new UserResource($this->layoutBy) : null,//for the forin ID/ display table/in model
            'layout_by' => $this->layout_by,//for edit page

            'assignedTo' =>  $this->assignedTo ? new UserResource($this->assignedTo) : null,//for the forin ID/ display table/in model
            'assigned_to' => $this->assigned_to,//for edit page

            
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'body' => $this->body,
            'caption' => $this->caption,
            
            'priority' => $this->priority,
            'status' => $this->status,
            'draft' => $this->draft,
            'visibility' => $this->visibility,

            'assigned_date' => $this->assigned_date ? (new Carbon($this->assigned_date))->format('F j, Y g:i A') : null,

            'content_submitted_date' => $this->content_submitted_date ? (new Carbon($this->content_submitted_date))->format('F j, Y g:i A') : null,

            'content_revision_message' => $this->content_revision_message,
            'content_revision_date' => $this->content_revision_date ? (new Carbon($this->content_revision_date))->format('F j, Y g:i A') : null,
            
            'content_approved_date' =>  $this->content_approved_date ? (new Carbon($this->content_approved_date))->format('F j, Y g:i A') : null,
            
            'image_submitted_date' => $this->image_submitted_date ? (new Carbon($this->image_submitted_date))->format('F j, Y g:i A') : null,

            'image_revision_message' => $this->image_revision_message,
            'image_revision_date' =>  $this->image_revision_date ? (new Carbon($this->image_revision_date))->format('F j, Y g:i A') : null,
            
            'task_completed_date' => $this->task_completed_date ? (new Carbon($this->task_completed_date))->format('F j, Y g:i A') : null,
            'taskCompletedDate' => $this->task_completed_date ? (new Carbon($this->task_completed_date))->format('Y-m-d') : null,

            'dueDate' => $this->due_date ? (new Carbon($this->due_date))->format('F j, Y g:i A') : null,//for table
            'due_date' => $this->due_date ? (new Carbon($this->due_date))->format('Y-m-d'): null,//for the form

            'task_image_path' => $this->task_image_path ? Storage::url($this->task_image_path) : '/images/default/article.png',
        ];
    }
}