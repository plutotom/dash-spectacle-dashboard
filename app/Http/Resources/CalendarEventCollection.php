<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\ResourceCollection;

class CalendarEventCollection extends ResourceCollection
{
    public function toArray($request)
    {
        $groupedEvents = [];

        foreach ($this->collection as $event) {
            // Parse the date with timezone consideration
            $startDateTime = $event->start?->dateTime;
            $startDate = $event->start?->date;

            if ($startDateTime) {
                $date = Carbon::parse($startDateTime, $event->start?->timeZone)
                    ->format('Y-m-d');
            } else {
                $date = Carbon::parse($startDate)->format('Y-m-d');
            }

            if (! isset($groupedEvents[$date])) {
                $groupedEvents[$date] = [];
            }

            $groupedEvents[$date][] = new CalendarEventResource($event);
        }

        ksort($groupedEvents);

        return $groupedEvents;
    }
}
