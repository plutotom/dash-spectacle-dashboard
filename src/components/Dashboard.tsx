import React, { useState, useEffect } from "react";
import {
  faCloud,
  faCloudRain,
  faCoffee,
  faSun,
} from "@fortawesome/free-solid-svg-icons";

// import "./../styles/dashboard.css";
import "./../styles/dashboardV2.css";

import banner from "../assets/codioful-formerly-gradienta-oPC-b39ZuzE-unsplash.jpg";
import banner2 from "../assets/looking-together.jpg";
import CardImage from "./CardImage";
import GooglePhotosComponent from "./GooglePhotos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import CardSmall from "./CardSmall";
import CardTodayWeather from "./cardTodayWeather";
import CardWeatherForecast from "./cardWeatherForecast";
import Todoist from "./Todoist";
import TimeAndDateCard from "./TimeAndDateCard";
import ErrorBoundary from "./errorBoundary";

import { getWeather } from "../shared/api/api";
import { weather } from "./../shared/types/types";

export default function Dashboard() {
  const [lon, setlon] = useState("-89.36973");
  const [lat, setLat] = useState("40.145934");
  const [location, setLocation] = useState({});
  const [weather, setWeather] = useState<weather | undefined>(undefined);

  // const effect = () => {
  // we want to call our fetch data route, with access to...
  //  - The state of the fetch, loading, fail, good etc,
  //  - This means we should either return what ever state it currently is in in a promise,
  //  - Or we handle the actual request here.

  // let baseRequest = Geo || Weather || etc.
  // fetchTool(baseRequest: enum, config: object)
  // or
  // fetchTool.Geo(location) || .Weather(location) || etc.()

  //? Both options can have different return types, promise, object data, etc.
  // fetchTool(baseRequest: enum, config: object).then((res) => {
  // setState(res.data);
  // }).catch((err) => {
  // setLoadingState(err)
  // })
  // or
  // let data = await fetchTool.Geo(location) || .Weather(location) || etc.()
  //! The problem with this is we do not know the current state, thus we assume it is loading until data is != null.
  //! Then we have to parse though data to see if it has an error
  // data.isError ? setError(true), setErrorMessage(data.error.message) : setState(data);
  // };

  // useEffect(() => {
  //   // console.log("about to run geo lcation request");
  //   let location: String = "213 thomas lincoln Il 62656 united states";
  //   axios
  //     .get(
  //       "https://api.geoapify.com/v1/geocode/search?text=" +
  //         location +
  //         "&apiKey=65852197164442b5b2322b285de696b1"
  //     )
  //     .then((res) => {
  //       console.log("res", res);
  //       let [long, lat] = res.data.features[0].geometry.coordinates;
  //       console.log("long", long);
  //       console.log("lat", lat);
  //     })
  //     .catch((err) => {
  //       console.log("err", err);
  //     });
  // }, []);

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
            <CardSmall
              className="card-small"
              title="Temp"
              value="30f"
              icon={faCoffee}
            />
            {/* {!weather ? "null" : <CardTodayWeather weatherForecast={weather} />} */}
            {!weather ? (
              "null"
            ) : (
              <CardWeatherForecast weatherForecast={weather} />
            )}
          </div>
          {/* <embed src="file:///Users/plutotom/Downloads/qr_code_wedding_svg.html" /> */}
        </div>
      </div>
    </>
  );
}
