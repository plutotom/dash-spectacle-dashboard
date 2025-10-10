<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\HomeAssistantController;
use App\Http\Resources\WeatherResource;
use Cache;
use Http;
use Illuminate\Support\Facades\Log;
use RakibDevs\Weather\Weather;

class WeatherController extends Controller
{
    private Weather $weatherService;

    private HomeAssistantController $homeAssistantController;

    public function __construct()
    {
        $this->weatherService = new Weather;
        $this->homeAssistantController = new HomeAssistantController;
    }

    // By Zip Code - string with country code
    public function OpenWeatherCurrent($zip, $countryCode = 'us')
    {
        $cacheKey = 'weather_current_'.$zip.'_'.$countryCode;
        // $weather = $this->weatherService->getCurrentByZip($zip, $countryCode);

        $info = Cache::remember($cacheKey, now()->addHour(), function () use ($zip, $countryCode) {
            return $this->weatherService->getCurrentByZip($zip, $countryCode);
        });

        return new WeatherResource($info);
    }

    public function current()
    {
        try {
            $cacheKey = 'weather_current_60120';
            $response = Cache::remember($cacheKey, now()->addMinutes(15), function () {
                $apiResponse = Http::get('http://api.weatherapi.com/v1/current.json', [
                    'key' => config('services.weather.api_key'),
                    'q' => config('services.weather.zip_code'),
                ]);

                if (! $apiResponse->successful()) {
                    Log::warning('WeatherAPI current request failed', [
                        'status' => $apiResponse->status(),
                        'body' => $apiResponse->body(),
                    ]);

                    return [];
                }

                return $apiResponse->json();
            });

            // getting local temperature from home assistant
            $homeAssistantData = $this->homeAssistantController->getLocalCurrentWeather();
            if (! isset($response['current'])) {
                $response['current'] = [];
            }
            $response['current']['home_assistant_current_temp'] = $homeAssistantData['temp'];
            $response['current']['last_updated'] = $homeAssistantData['last_updated'] ?? ($response['current']['last_updated'] ?? null);

            return new WeatherResource($response);
        } catch (\Throwable $e) {
            Log::error('WeatherController current endpoint error', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to fetch current weather',
            ], 200);
        }
    }

    public function forecast()
    {
        try {
            $cacheKey = 'weather_forecast_60120';
            $response = Cache::remember($cacheKey, now()->addMinutes(15), function () {
                Log::info('getting new forcast weather data');

                $apiResponse = Http::get('http://api.weatherapi.com/v1//forecast.json', [
                    'key' => config('services.weather.api_key'),
                    'q' => config('services.weather.zip_code'),
                    'days' => '3', // 3 days is our max on free plan
                ]);

                if (! $apiResponse->successful()) {
                    Log::warning('WeatherAPI forecast request failed', [
                        'status' => $apiResponse->status(),
                        'body' => $apiResponse->body(),
                    ]);

                    return [];
                }

                return $apiResponse->json();
            });

            return new WeatherResource($response);
        } catch (\Throwable $e) {
            Log::error('WeatherController forecast endpoint error', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to fetch forecast weather',
            ], 200);
        }
    }
}
