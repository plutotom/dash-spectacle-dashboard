import React from "react";
import {
  faCloud,
  faCloudRain,
  faCoffee,
  faRainbow,
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

const dashboardV2 = () => {
  return (
    <>
      {/* {console.log(weather, "state")} */}
      <div className="dash-container">
        <div
          className="dash-banner"
          // style={{ backgroundImage: "url ('urlhere'" }}
          style={{ backgroundImage: `url(${banner2})` }}
        >
          <h1>Dashboard banner</h1>
        </div>
        {/* <img src={`${banner}`} alt="diannal lines background" /> */}
        <div className="dash-content">
          <div className="row">
            <div>
              <TimeAndDateCard />
            </div>

            <ErrorBoundary>{/* <GooglePhotosComponent /> */}</ErrorBoundary>
          </div>
          <div className="row">
            <div>
              <TimeAndDateCard />
            </div>
            <div>
              <Todoist />
            </div>
            <div>
              <CardMedium />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default dashboardV2;
