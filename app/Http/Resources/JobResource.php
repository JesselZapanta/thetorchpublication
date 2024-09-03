<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobResource extends JsonResource
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
            'queue' => $this->queue,
            'payload' => $this->payload,
            'attepmts' => $this->attepmts,
            'reserved_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'available_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
        ];
    }
}
