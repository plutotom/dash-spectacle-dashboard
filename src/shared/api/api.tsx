import axios from "axios";
import urls from "./urls";

export async function getGeoLocation(
  location = "213 thomas lincoln Il 62656 united states"
) {
  // https://api.geoapify.com/v1/geocode/search?text=38%20Upper%20Montagu%20Street%2C%20Westminster%20W1H%201LJ%2C%20United%20Kingdom&apiKey=65852197164442b5b2322b285de696b1
  const url = urls.getGeoLocation + "json?address=" + location;
  const res = await axios.get(url);
  return res;
}

export async function getWeather(lon: String, lat: String) {
  //api.weather.gov/points/40.145934,-89.36973
  const url = urls.getWeatherPoints + "/" + lat + "," + lon;
  console.log("url", url);
  const [forecastRes, forecastHourlyRes] = await axios
    .get(url)
    .then(async (res) => {
      // res.data.properties.forecast -> Object forecast data
      // res.data.properties.forecastHourly
      // res.data.properties.relativeLocation.city = Lincoln
      // res.data.properties.relativeLocation.state -> IL
      let forecastResTemp = await axios
        .get(res.data.properties.forecast)
        .then((res) => {
          // res.data.properties.periods -> Array of forecast data
          // "properties": {
          //   "updated": "2023-05-02T15:41:31+00:00",
          //   "units": "us",
          //   "forecastGenerator": "BaselineForecastGenerator",
          //   "generatedAt": "2023-05-02T16:55:28+00:00",
          //   "updateTime": "2023-05-02T15:41:31+00:00",
          //   "validTimes": "2023-05-02T09:00:00+00:00/P7DT16H",
          //   "elevation": {
          //       "unitCode": "wmoUnit:m",
          //       "value": 181.96559999999999
          //   },
          //   "periods": [
          //       {
          //           "number": 1,
          //           "name": "Today",
          //           "startTime": "2023-05-02T11:00:00-05:00",
          //           "endTime": "2023-05-02T18:00:00-05:00",
          //           "isDaytime": true,
          //           "temperature": 62,
          //           "temperatureUnit": "F",
          //           "temperatureTrend": null,
          //           "probabilityOfPrecipitation": {
          //               "unitCode": "wmoUnit:percent",
          //               "value": null
          //           },
          //           "dewpoint": {
          //               "unitCode": "wmoUnit:degC",
          //               "value": 0
          //           },
          //           "relativeHumidity": {
          //               "unitCode": "wmoUnit:percent",
          //               "value": 43
          //           },
          //           "windSpeed": "20 to 23 mph",
          //           "windDirection": "NW",
          //           "icon": "https://api.weather.gov/icons/land/day/wind_few?size=medium",
          //           "shortForecast": "Sunny",
          //           "detailedForecast": "Sunny, with a high near 62. Northwest wind 20 to 23 mph, with gusts as high as 39 mph."
          //       },
          //       { ...
          return res.data;
        });
      let forecastHourlyResTemp = await axios
        .get(res.data.properties.forecastHourly)
        .then((res) => {
          return res.data;
        });

      return [forecastResTemp, forecastHourlyResTemp];
    });
  return [forecastRes, forecastHourlyRes];
}
