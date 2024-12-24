<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CalendarEventResource;
use Spatie\GoogleCalendar\Event;
use Carbon\Carbon;
use Exception;

class CalendarEventController extends Controller
{

    public function index()
    {
        try {
            $startDate = Carbon::now();
            $endDate = Carbon::now()->addMonth();
            
            $events = Event::get($startDate, $endDate);

            return CalendarEventResource::collection($events);

        } catch (Exception $e) {
            \Log::error('Calendar Error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch calendar events'], 500);
        }
    }
} 
