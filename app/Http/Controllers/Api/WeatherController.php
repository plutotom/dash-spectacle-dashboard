<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\HomeAssistantController;
use App\Http\Resources\WeatherResource;
use Cache;
use Http;
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
        $cacheKey = 'weather_current_60120';
        $response = Cache::remember($cacheKey, now()->addMinutes(15), function () {
            return Http::get('http://api.weatherapi.com/v1/current.json', [
                'key' => config('services.weather.api_key'),
                'q' => config('services.weather.zip_code'),
            ])->json();
        });

        //? getting local temperature frosm home assistant
        $homeAssistantData = $this->homeAssistantController->getLocalCurrentWeather();
        $response['current']['home_assistant_current_temp'] = $homeAssistantData['temp'];
        $response['current']['last_updated'] = $homeAssistantData['last_updated'];

        return new WeatherResource($response);
    }

    public function forecast()
    {

        $cacheKey = 'weather_forecast_60120';
        $response = Cache::remember($cacheKey, now()->addMinutes(15), function () {
            \Log::info('getting new forcast weather data');

            return Http::get('http://api.weatherapi.com/v1//forecast.json', [
                'key' => config('services.weather.api_key'),
                'q' => config('services.weather.zip_code'),
                'days' => '3', // 3 days is our max on free plan
            ])->json();
        });

        return new WeatherResource($response);
    }
}
