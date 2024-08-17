<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
            'category_id' => $this->category_id,

            'layoutBy' => new UserResource($this->layoutBy),//for the forin ID/ display table/in model
            'layout_by' => $this->layout_by,//for edit page

            'assignedBy' => new UserResource($this->assignedBy),//for the forin ID/ display table/in model
            'assigned_by' => $this->assigned_by,//for edit page

            'description' => $this->description,
            'body' => $this->body,
            'message' => $this->message,
            'priority' => $this->priority,
            'status' => $this->status,
            'due_date' => (new Carbon($this->due_date))->format('Y-m-d'),
            'task_image_path' => $this->task_image_path,
        ];
    }
}