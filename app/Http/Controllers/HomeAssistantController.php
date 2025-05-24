<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;

class HomeAssistantController extends Controller
{
    /**
     * Get the local current weather from the home assistant
     *
     * @return array [
     *               'temp' => int,
     *               'last_updated' => string,
     *               ]
     */
    public function getLocalCurrentWeather(): array
    {
        $url = config('services.homeAssistant.url');
        $token = config('services.homeAssistant.token');
        $entityIds = explode(',', config('services.homeAssistant.local_temperature_entity_id')); // entity ids for the sensors

        $averagedTemp = null;
        $lastUpdated = null;

        foreach ($entityIds as $key => $value) {
            $response = Http::withHeaders([
                'Authorization' => "Bearer $token",
                'Content-Type' => 'application/json',
            ])->get("$url/api/states/$value");
            if ($response->successful()) {
                // $data = $response->json();
                $averagedTemp += $response->json()['state'];
                $lastUpdated = $response->json()['last_updated'];
            } else {
                return response()->json(['error' => 'Unable to fetch temperature'], 500);
            }
        }

        $averagedTemp = round($averagedTemp / count($entityIds));

        return [
            'temp' => $averagedTemp,
            'last_updated' => $lastUpdated,
        ];
    }
}
