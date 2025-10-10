<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

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
        $entityIdsConfig = config('services.homeAssistant.local_temperature_entity_id');

        if (empty($url) || empty($token) || empty($entityIdsConfig)) {
            Log::warning('HomeAssistant config missing for local temperature fetch');

            return [
                'temp' => null,
                'last_updated' => null,
            ];
        }

        $entityIds = array_filter(array_map('trim', explode(',', $entityIdsConfig)));

        $sumTemp = 0.0;
        $count = 0;
        $lastUpdated = null;

        foreach ($entityIds as $entityId) {
            try {
                $response = Http::withHeaders([
                    'Authorization' => "Bearer $token",
                    'Content-Type' => 'application/json',
                ])->get("$url/api/states/$entityId");

                if (! $response->successful()) {
                    Log::warning('HomeAssistant temperature fetch failed', [
                        'entity' => $entityId,
                        'status' => $response->status(),
                        'body' => $response->body(),
                    ]);

                    continue;
                }

                $data = $response->json();
                $state = is_numeric($data['state'] ?? null) ? (float) $data['state'] : null;
                if ($state === null) {
                    Log::warning('HomeAssistant temperature state not numeric', [
                        'entity' => $entityId,
                        'state' => $data['state'] ?? null,
                    ]);

                    continue;
                }

                $sumTemp += $state;
                $count++;
                $lastUpdated = $data['last_updated'] ?? $lastUpdated;
            } catch (\Throwable $e) {
                Log::error('HomeAssistant temperature fetch exception', [
                    'entity' => $entityId,
                    'message' => $e->getMessage(),
                ]);

                continue;
            }
        }

        if ($count === 0) {
            // No readings available; return nulls rather than throwing to avoid 500s
            return [
                'temp' => null,
                'last_updated' => $lastUpdated,
            ];
        }

        $averagedTemp = round($sumTemp / $count);

        return [
            'temp' => $averagedTemp,
            'last_updated' => $lastUpdated,
        ];
    }
}
