<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Collection;

class CalendarEventCollection extends ResourceCollection
{
    public function toArray($request)
    {
        $groupedEvents = $this->collection->groupBy(function ($event) {
            return date('Y-m-d', strtotime($event->start->dateTime));
        });

        return $groupedEvents->map(function ($dayEvents) {
            return CalendarEventResource::collection($dayEvents);
        });
    }
} 