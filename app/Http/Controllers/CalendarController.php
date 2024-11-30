<?php

namespace App\Http\Controllers;

use Spatie\GoogleCalendar\Event;
use Carbon\Carbon;
use Illuminate\Support\Collection;
class CalendarController extends Controller
{
    public static function getEvents(): Collection
    {
        // throw error
        $startDate = Carbon::now();
        $endDate = Carbon::now()->addMonth();
        
        $events = Event::get($startDate, $endDate);
        
        $formattedEvents = $events->map(function($event) {
            return [
                'id' => $event->id,
                'name' => $event->name,
                'startDateTime' => $event->startDateTime,
                'endDateTime' => $event->endDateTime,
                'description' => $event->description,
            ];
        });

        return $formattedEvents;        
    }
} 