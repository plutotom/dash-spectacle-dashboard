<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CalendarEventResource;
use Spatie\GoogleCalendar\Event;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Cache;
use App\Http\Resources\CalendarEventCollection;

class CalendarEventController extends Controller
{

    public function index()
    {
        try {
            $cacheKey = 'calendar_events_' . Carbon::now()->format('Y-m-d_H-i-s');
            $events = Cache::remember($cacheKey, now()->addMinutes(15), function () {
                $startDate = Carbon::now();
                $endDate = Carbon::now()->addMonth();
                return Event::get($startDate, $endDate);
            });
            
            return new CalendarEventCollection($events);

        } catch (Exception $e) {
            \Log::error('Calendar Error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch calendar events' . $e->getMessage(), 'error_code' => $e->getCode()], 500);
        }
    }
}