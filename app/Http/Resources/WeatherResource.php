<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WeatherResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = [
            'location' => [
                'name' => $this->resource['location']['name'] ?? null,
                'region' => $this->resource['location']['region'] ?? null,
                'country' => $this->resource['location']['country'] ?? null,
                'lat' => $this->resource['location']['lat'] ?? null,
                'lon' => $this->resource['location']['lon'] ?? null,
                'tz_id' => $this->resource['location']['tz_id'] ?? null,
                'localtime_epoch' => $this->resource['location']['localtime_epoch'] ?? null,
                'localtime' => $this->resource['location']['localtime'] ?? null,
            ],
            'current' => [
                'last_updated' => $this->resource['current']['last_updated'] ?? null,
                'temp_f' => $this->resource['current']['temp_f'] ?? null,
                'is_day' => $this->resource['current']['is_day'] ?? null,
                'condition' => [
                    'text' => $this->resource['current']['condition']['text'] ?? null,
                    'icon' => $this->resource['current']['condition']['icon'] ?? null,
                    'code' => $this->resource['current']['condition']['code'] ?? null,
                ],
                'wind_mph' => $this->resource['current']['wind_mph'] ?? null,
                'wind_degree' => $this->resource['current']['wind_degree'] ?? null,
                'wind_dir' => $this->resource['current']['wind_dir'] ?? null,
                'pressure_in' => $this->resource['current']['pressure_in'] ?? null,
                'precip_in' => $this->resource['current']['precip_in'] ?? null,
                'humidity' => $this->resource['current']['humidity'] ?? null,
                'cloud' => $this->resource['current']['cloud'] ?? null,
                'feelslike_f' => $this->resource['current']['feelslike_f'] ?? null,
                'windchill_f' => $this->resource['current']['windchill_f'] ?? null,
                'heatindex_f' => $this->resource['current']['heatindex_f'] ?? null,
                'dewpoint_f' => $this->resource['current']['dewpoint_f'] ?? null,
                'vis_miles' => $this->resource['current']['vis_miles'] ?? null,
                'uv' => $this->resource['current']['uv'] ?? null,
                'gust_mph' => $this->resource['current']['gust_mph'] ?? null,
            ],
        ];

        // Add forecast data if it exists
        if (isset($this->resource['forecast']['forecastday'])) {
            $data['forecast'] = array_map(function ($day) {
                return [
                    'date' => $day['date'] ?? null,
                    'date_epoch' => $day['date_epoch'] ?? null,
                    'day' => [
                        'maxtemp_f' => $day['day']['maxtemp_f'] ?? null,
                        'mintemp_f' => $day['day']['mintemp_f'] ?? null,
                        'avgtemp_f' => $day['day']['avgtemp_f'] ?? null,
                        'maxwind_mph' => $day['day']['maxwind_mph'] ?? null,
                        'totalprecip_in' => $day['day']['totalprecip_in'] ?? null,
                        'avghumidity' => $day['day']['avghumidity'] ?? null,
                        'condition' => [
                            'text' => $day['day']['condition']['text'] ?? null,
                            'icon' => $day['day']['condition']['icon'] ?? null,
                            'code' => $day['day']['condition']['code'] ?? null,
                        ],
                        'daily_chance_of_rain' => $day['day']['daily_chance_of_rain'] ?? null,
                    ],
                    'astro' => [
                        'sunrise' => $day['astro']['sunrise'] ?? null,
                        'sunset' => $day['astro']['sunset'] ?? null,
                        'moonrise' => $day['astro']['moonrise'] ?? null,
                        'moonset' => $day['astro']['moonset'] ?? null,
                        'moon_phase' => $day['astro']['moon_phase'] ?? null,
                    ],
                ];
            }, $this->resource['forecast']['forecastday']);
        }

        return $data;
    }
}
