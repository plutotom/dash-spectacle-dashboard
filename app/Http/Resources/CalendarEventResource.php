<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CalendarEventResource extends JsonResource
{
    public function toArray($request)
    {
        $startDateTime = $this->start?->dateTime;
        $endDateTime = $this->end?->dateTime;

        return [
            'id' => $this->id,
            'summary' => $this->summary,
            'description' => $this->description ?? null,
            'start' => [
                'dateTime' => $startDateTime,
            ],
            'end' => [
                'dateTime' => $endDateTime,
            ],
            'isAllDay' => $this->isAllDayEvent(),
            'status' => $this->status ?? 'confirmed',
            'htmlLink' => $this->htmlLink ?? '',
        ];
    }

    protected function isAllDayEvent(): bool
    {
        return ! is_null($this->start?->date) && is_null($this->start?->dateTime);
    }
}
