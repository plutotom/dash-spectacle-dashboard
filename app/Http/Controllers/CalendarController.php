<?php

namespace App\Http\Controllers;

use Spatie\GoogleCalendar\Event;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Exception;

class CalendarController extends Controller
{
    public static function getEvents(): Collection
    {
        try {
            $startDate = Carbon::now();
            $endDate = Carbon::now()->addMonth();
            
            $events = Event::get($startDate, $endDate);
            
            return $events->map(function($event) {
                return [
                    'id' => $event->id,
                    'name' => $event->name,
                    'startDateTime' => $event->startDateTime,
                    'endDateTime' => $event->endDateTime,
                    'description' => $event->description,
                ];
            });
        } catch (Exception $e) {
            // Log the error for debugging
            \Log::error('Calendar Error: ' . $e->getMessage());
            throw new Exception('Failed to fetch calendar events: ' . $e->getMessage());
        }
    }
} 