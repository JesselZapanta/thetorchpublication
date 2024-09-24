<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class AcademicYearResource extends JsonResource
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
            'code' => $this->code,
            'description' => $this->description,
            'status' => $this->status,

            'start_at' => $this->start_at ? (new Carbon($this->start_at))->format('Y-m-d') : null,//Y-m-d in form to avoid error in update
            'end_at' => $this->end_at ?  (new Carbon($this->end_at))->format('Y-m-d') : null,


            'startAt' => $this->start_at ? (new Carbon($this->start_at))->format('F j, Y') : null, //display in table
            'endAt' => $this->end_at ?  (new Carbon($this->end_at))->format('F j, Y') : null,//display in table

            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'updated_at' => (new Carbon($this->updated_at))->format('Y-m-d'),
        ];
    }
}
