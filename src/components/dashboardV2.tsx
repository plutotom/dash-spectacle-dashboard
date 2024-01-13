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
import TimeAndDateCardOld from "./oldComponents/timeDate";
import CardWeatherForecast from "./cardWeatherForecast";
// import Todoist from "./Todoist";
import TimeAndDateCard from "./TimeAndDateCard";
import ErrorBoundary from "./errorBoundary";
import { SpotifyNowPlaying } from "./spotify/SpotifyNowPlaying";

import NotionPage from "./notion/NotionPage";

// import ProgressCircleSVG from "./ProgressCircleSVG";
import ProgressCircle from "./ProgressCircle";
// import ErrorBoundary from "./errorBoundary";

const DashboardV2 = () => {
  return (
    <>
      {/* {console.log(weather, "state")} */}
      <div className="dash-container">
        <div className="dash-content">
          <div className="headerTime">
            <TimeAndDateCard />
          </div>
          <div className="row">
            <div className="card card-medium">
              {/* <NotionPage /> */}

              <h1 className="">Here is an h1</h1>
              {/* <SpotifyNowPlaying
                client_id={process.env.REACT_APP_SPOTIFY_CLIENT_ID || ""}
                client_secret={
                  process.env.REACT_APP_SPOTIFY_CLIENT_SECRET || ""
                }
                refresh_token={
                  process.env.REACT_APP_SPOTIFY_REFRESH_TOKEN || ""
                }
              /> */}
            </div>
            <div>
              <CardTodayWeather />
            </div>
            {/* <ErrorBoundary> <GooglePhotosComponent /> </ErrorBoundary> */}
          </div>
          <div className="row">
            <div>
              <TimeAndDateCardOld />
            </div>
            <div>
              {/* <CardMedium title="title" icon={faCloud} cardText="Dummy data" /> */}
              <ErrorBoundary>
                <CardWeatherForecast />
              </ErrorBoundary>
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
