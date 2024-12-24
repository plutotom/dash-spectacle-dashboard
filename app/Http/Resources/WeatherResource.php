<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WeatherResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
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
    }
} 