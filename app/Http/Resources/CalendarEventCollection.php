<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class CalendarEventCollection extends ResourceCollection
{
    public function toArray($request)
    {
        //todo it seems that some all day events do not have a startdateTime. need to look into this to handle them, but for now this will work.
        $filteredEvents = $this->collection->filter(function ($event) {
            return gettype($event->start->dateTime) === 'string';
        });

        $groupedEvents = $filteredEvents->groupBy(function ($event) {
            return date('Y-m-d', strtotime($event->start->dateTime));
        });

        return $groupedEvents->map(function ($dayEvents) {
            return CalendarEventResource::collection($dayEvents);
        });
    }
}
