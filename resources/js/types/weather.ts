interface Location {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
}

interface Condition {
    text: string;
    icon: string;
    code: number;
}

interface AirQuality {
    co: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    'us-epa-index': number;
    'gb-defra-index': number;
}

interface Current {
    last_updated: string;
    temp_f: number;
    is_day: number;
    condition: Condition;
    wind_mph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_in: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_f: number;
    windchill_f: number;
    heatindex_f: number;
    dewpoint_f: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    air_quality: AirQuality;
}

interface Weather {
    current: Current;
    location: Location;
}

export type { Weather };
