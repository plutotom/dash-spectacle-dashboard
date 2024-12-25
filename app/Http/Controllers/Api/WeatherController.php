<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Cache;
use Http;
use RakibDevs\Weather\Weather;
use App\Http\Resources\WeatherResource;

class WeatherController extends Controller
{
    private Weather $weatherService;

    public function __construct()
    {
        $this->weatherService = new Weather();
    }

    // By Zip Code - string with country code
    public function OpenWeatherCurrent($zip, $countryCode = 'us')
    {
        $cacheKey = "weather_current_" . $zip . "_" . $countryCode;
        $weather = $this->weatherService->getCurrentByZip($zip, $countryCode);

        $info = Cache::remember($cacheKey, now()->addHour(), function () use ($zip, $countryCode) {
            return $this->weatherService->getCurrentByZip($zip, $countryCode);
        });

        return new WeatherResource($info);
    }


    public function current()
    {
        $cacheKey = 'weather_current_60120';
        $response = Cache::remember($cacheKey, now()->addMinutes(15), function () {
            \Log::info("getting new current weather data");
            return Http::get('http://api.weatherapi.com/v1/current.json', [
                'key' => config('services.weather.api_key'),
                'q' => '60120',
            ])->json();
        });

        return new WeatherResource($response);
    }


    public function forecast() {

        $cacheKey = 'weather_forecast_60120';
        $response = Cache::remember($cacheKey, now()->addMinutes(15), function(){
            \Log::info("getting new forcast weather data");
            return Http::get('http://api.weatherapi.com/v1//forecast.json', [
                'key' => config('services.weather.api_key'),
                'q' => '60120',
                'days' => '5'
            ])->json();
        });

        // dd($response);

        return new WeatherResource($response);
    }
}

