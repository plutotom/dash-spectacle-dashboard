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
          <div className="content-top">
            <div className="time-date">
              <TimeAndDateCard />
            </div>
          </div>
          <Todoist />
          <div className="cards">
            {/* <CardImage /> */}
            <ErrorBoundary>
              <GooglePhotosComponent />
            </ErrorBoundary>
          </div>
          {/* <embed src="file:///Users/plutotom/Downloads/qr_code_wedding_svg.html" /> */}
        </div>
      </div>
    </>
  );
};

export default dashboardV2;
