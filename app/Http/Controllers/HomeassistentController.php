<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class HomeassistentController extends Controller
{
    public function getLocalCurrentWeather(): mixed
    {
        $url = config('services.homeassistant.url');
        $token = config('services.homeassistant.token');
        $entityId = config('services.homeassistant.local_temperature_entity_id'); // entity id for the sensor

        $response = Http::withHeaders([
            'Authorization' => "Bearer $token",
            'Content-Type' => 'application/json',
        ])->get("$url/api/states/$entityId");

        if ($response->successful()) {
            $data = $response->json();
            //? datatype 
            // array:7 [ // app/Http/Controllers/HomeassistentController.php:21
            //     "entity_id" => "sensor.blink_long_live_guy_temperature"
            //     "state" => "61"
            //     "attributes" => array:4 [
            //       "state_class" => "measurement"
            //       "unit_of_measurement" => "°F"
            //       "device_class" => "temperature"
            //       "friendly_name" => "Long-live-guy Temperature"
            //     ]
            //     "last_changed" => "2025-05-04T17:10:03.007225+00:00"
            //     "last_reported" => "2025-05-04T17:10:03.007225+00:00"
            //     "last_updated" => "2025-05-04T17:10:03.007225+00:00"
            //     "context" => array:3 [
            //       "id" => "01JTE4DEFZKAGN2980M8QG6RH2"
            //       "parent_id" => null
            //       "user_id" => null
            //     ]
            //   ]
            // return $data['state']; // This is the temperature value
            return $data;
        }

        return response()->json(['error' => 'Unable to fetch temperature'], 500);
    }
}
