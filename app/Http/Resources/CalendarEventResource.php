<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CalendarEventResource extends JsonResource
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
            'summary' => $this->summary,
            'description' => $this->description,
            'start' => [
                'dateTime' => $this->start['dateTime'],
                'timeZone' => $this->start['timeZone'],
            ],
            'end' => [
                'dateTime' => $this->end['dateTime'],
                'timeZone' => $this->end['timeZone'],
            ],
            'status' => $this->status,
            'htmlLink' => $this->htmlLink,
        ];
    }
}
