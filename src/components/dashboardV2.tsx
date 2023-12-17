import React, { useState, useEffect } from "react";
import {
  faCloud,
  faCloudRain,
  faCoffee,
  faSun,
} from "@fortawesome/free-solid-svg-icons";

import "./../styles/dashboardV2.css";

// import banner2 from "../assets/looking-together.jpg";
// import GooglePhotosComponent from "./GooglePhotos";
// import CardSmall from "./CardSmall";
import CardMedium from "./CardMedium";
import CardTodayWeather from "./cardTodayWeather";
// import CardWeatherForecast from "./cardWeatherForecast";
// import Todoist from "./Todoist";
import TimeAndDateCard from "./TimeAndDateCard";
// import ErrorBoundary from "./errorBoundary";

const DashboardV2 = () => {
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
              <CardMedium
                title="Md Card"
                icon={faCoffee}
                cardText="Dummy data"
              />
            </div>
            <div>
              <CardTodayWeather />
            </div>
            {/* <ErrorBoundary> <GooglePhotosComponent /> </ErrorBoundary> */}
          </div>
          <div className="row">
            <div>
              <TimeAndDateCard />
            </div>
            <div>
              <CardMedium title="title" icon={faCloud} cardText="Dummy data" />
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
