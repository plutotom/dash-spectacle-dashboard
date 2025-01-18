<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class CalendarEventCollection extends ResourceCollection
{
    public function toArray($request)
    {
        $groupedEvents = [];

        foreach ($this->collection as $event) {
            $startDateTime = $event->start?->dateTime;
            $startDate = $event->start?->date;

            if ($startDateTime) {
                $date = $startDateTime;
            } else {
                $date = $startDate;
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
