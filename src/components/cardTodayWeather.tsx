import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { weather } from "../shared/types/types";
import "../styles/card.css";
import {
  faCloud,
  faCloudRain,
  faSun,
  faNotdef,
} from "@fortawesome/free-solid-svg-icons";
import { getWeather, getGeoLocation } from "../shared/api/api";
import { useEffect, useState } from "react";
import ErrorBoundary from "./errorBoundary";

export default function CardTodayWeather() {
  const lonENV = process.env.REACT_APP_LOCATION_LON;
  const latENV = process.env.REACT_APP_LOCATION_LAT;
  const [lon, setlon] = useState(lonENV || "-89.8");
  const [lat, setLat] = useState(latENV || "40.5");
  const [location, setLocation] = useState(undefined);
  const [locationTownName, setLocationTownName] = useState("");
  const [weather, setWeather] = useState<weather | undefined>(undefined);

  useEffect(() => {
    const fetchLocation = async () => {
      let locationTemp = await getGeoLocation(
        "8 N state st Elgin Il 60123, United States"
      );
      setLocation(locationTemp);
      setLocationTownName(locationTemp?.features[0]?.properties?.city);
      setLat(locationTemp?.features[0]?.properties?.lat);
      setlon(locationTemp?.features[0]?.properties?.lon);
    };
    fetchLocation();

    const fetchData = async () => {
      let [forecastDay, forecastHourly] = await getWeather(lon, lat);
      return [forecastDay, forecastHourly];
    };

    fetchData()
      .then(([forecastDay, forecastHourly]) => {
        setWeather({
          today: {
            day: forecastDay.properties.periods[0].name,
            temp: {
              current: forecastHourly.properties.periods[0].temperature,
              high: forecastDay.properties.periods[0].temperature,
              low: forecastDay.properties.periods[1].temperature,
            },
            description: forecastDay.properties.periods[0].shortForecast,
            icon: faCloud,
          },
          tomorrow: {
            day: forecastDay.properties.periods[2].name,
            description: forecastDay.properties.periods[3].shortForecast,
            temp: {
              high: forecastDay.properties.periods[2].temperature,
              low: forecastDay.properties.periods[3].temperature,
            },
            icon: faSun,
          },
          dayAfterTomorrow: {
            day: forecastDay.properties.periods[4].name,
            temp: {
              // not sure why this is 5 and 4 seem backwards
              high: forecastDay.properties.periods[5].temperature,
              low: forecastDay.properties.periods[4].temperature,
            },
            description: forecastDay.properties.periods[4].shortForecast,
            icon: faCloudRain,
          },
        });
      })
      .catch((err) =>
        console.log(
          err,
          "There was an error is trying to set the weathers state"
        )
      );
  }, [lat, lon]);
  return (
    <>
      <div className="card card-medium">
        <ErrorBoundary>
          {!weather && (
            <div>
              <FontAwesomeIcon icon={faNotdef} />
              <p>No weather data Found for {locationTownName} </p>
            </div>
          )}

          {weather && (
            <div className="medium-top">
              <div>
                <h3>{weather.today.temp.current || "Na"}</h3>
                <p className="location">
                  {location ? locationTownName : "Mason City, IL"}
                </p>
              </div>
              <p className="medium-temp">
                H:{weather.today.temp.high}° L:
                {weather.today.temp.low}°
              </p>
              <div className="weatherIcon">
                <FontAwesomeIcon className="" icon={weather.today.icon} />
              </div>
              <div className="medium-bottom">
                <div className="medium-row">
                  <FontAwesomeIcon
                    className="medium-icon"
                    icon={weather.tomorrow.icon}
                  />
                  <p className="card-small-title">
                    {weather.tomorrow.day}: {weather.tomorrow.temp.high}°{"/"}
                    {weather.tomorrow.temp.low}°
                  </p>
                </div>
                <div className="medium-row">
                  <FontAwesomeIcon
                    className="medium-icon"
                    icon={weather.dayAfterTomorrow.icon}
                  />
                  <p className="card-small-paragraph">
                    {weather.dayAfterTomorrow.day}:{" "}
                    {weather.dayAfterTomorrow.temp.high}°{"/"}
                    {weather.dayAfterTomorrow.temp.low}°
                  </p>
                </div>
              </div>
            </div>
          )}
        </ErrorBoundary>
      </div>
    </>
  );
}
