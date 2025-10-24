<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrayerRequestResource extends JsonResource
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
            'notion_id' => $this->notion_id,
            'prayer_request_from' => $this->prayer_request_from,
            'prayer_for' => $this->prayer_for,
            'is_answered' => $this->is_answered,
            'prayer_request' => $this->prayer_request,
            'answered_at' => $this->answered_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
