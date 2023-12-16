import React, { useState, useEffect } from "react";
import {
  faCloud,
  faCloudRain,
  faCoffee,
  faSun,
} from "@fortawesome/free-solid-svg-icons";

import "./../styles/dashboardV2.css";

import banner2 from "../assets/looking-together.jpg";
import GooglePhotosComponent from "./GooglePhotos";
import CardSmall from "./CardSmall";
import CardMedium from "./CardMedium";
import CardTodayWeather from "./cardTodayWeather";
import CardWeatherForecast from "./cardWeatherForecast";
import Todoist from "./Todoist";
import TimeAndDateCard from "./TimeAndDateCard";
import ErrorBoundary from "./errorBoundary";

import { getWeather } from "../shared/api/api";
import { weather } from "./../shared/types/types";

const DashboardV2 = () => {
  const [lon, setlon] = useState("-89.36973");
  const [lat, setLat] = useState("40.145934");
  const [location, setLocation] = useState({});
  const [weather, setWeather] = useState<weather | undefined>(undefined);

  useEffect(() => {
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
              high: forecastDay.properties.periods[4].temperature,
              low: forecastDay.properties.periods[5].temperature,
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
  }, []);

  return (
    <>
      {/* {console.log(weather, "state")} */}
      <div className="dash-container">
        <div className="dash-content">
          <div className="row">
            <div>
              <TimeAndDateCard />
            </div>
            <div>
              <CardMedium />
            </div>

            {/* <ErrorBoundary> <GooglePhotosComponent /> </ErrorBoundary> */}
          </div>
          <div className="row">
            <div>
              <TimeAndDateCard />
            </div>
            <div>
              <CardMedium />
            </div>
            <div className="cards">
              {/* <CardImage /> */}
              {/* <ErrorBoundary>
                <GooglePhotosComponent />
              </ErrorBoundary> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardV2;
