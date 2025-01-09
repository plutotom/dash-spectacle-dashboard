<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class CalendarEventResource extends JsonResource
{
    public function toArray($request)
    {
        $startDateTime = $this->start?->dateTime;
        $startDate = $this->start?->date;
        $endDateTime = $this->end?->dateTime;
        $endDate = $this->end?->date;

        return [
            'id' => $this->id,
            'summary' => $this->summary,
            'description' => $this->description ?? null,
            'start' => [
                'dateTime' => $this->formatDateTime($startDateTime, $startDate),
                'timeZone' => $startDateTime ? ($this->start?->timeZone ?? 'UTC') : null,
            ],
            'end' => [
                'dateTime' => $this->formatDateTime($endDateTime, $endDate),
                'timeZone' => $endDateTime ? ($this->end?->timeZone ?? 'UTC') : null,
            ],
            'isAllDay' => $this->isAllDayEvent(),
            'status' => $this->status ?? 'confirmed',
            'htmlLink' => $this->htmlLink ?? '',
        ];
    }

    protected function formatDateTime($dateTime, $date)
    {
        if ($dateTime instanceof \DateTime || $dateTime instanceof Carbon) {
            return $dateTime->toIso8601String();
        }

        if ($dateTime) {
            return Carbon::parse($dateTime)->toIso8601String();
        }

        if ($date) {
            return Carbon::parse($date)->startOfDay()->toIso8601String();
        }

        return null;
    }

    protected function isAllDayEvent(): bool
    {
        return ! is_null($this->start?->date) && is_null($this->start?->dateTime);
    }
}
