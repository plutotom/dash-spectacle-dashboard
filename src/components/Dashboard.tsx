import React, { useState, useEffect } from "react";
import banner from "../assets/codioful-formerly-gradienta-oPC-b39ZuzE-unsplash.jpg";
import banner2 from "../assets/looking-together.jpg";
import "./../styles/dashbaord.css";
import CardSmall from "./CardSmall";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, faSun } from "@fortawesome/free-solid-svg-icons";

import CardMedium from "./cardMedium";
import CardWeatherForecast from "./cardWeatherForecast";
import { getWeather } from "../shared/api/api";
import CardImage from "./CardImage";

import { weather } from "./../shared/types/types";

// interface weather {
//   today: {
//     temp: { high: string; low: string };
//     day: string;
//     description: string;
//     icon: any;
//   };
//   tomorrow: {
//     temp: { high: string; low: string };
//     day: string;
//     description: string;
//     icon: any;
//   };
//   dayAfterTomorrow: {
//     temp: { high: string; low: string };
//     day: string;
//     description: string;
//     icon: any;
//   };
// }

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
        console.log("res", forecastDay.properties.periods[0]);
        setWeather({
          today: {
            day: forecastDay.properties.periods[0].name,
            temp: {
              high: forecastDay.properties.periods[0].temperature,
              low: forecastDay.properties.periods[1].temperature,
            },
            description: forecastDay.properties.periods[0].shortForecast,
            icon: faCoffee,
          },
          tomorrow: {
            day: forecastDay.properties.periods[2].name,
            description: forecastDay.properties.periods[3].shortForecast,
            temp: {
              high: forecastDay.properties.periods[2].temperature,
              low: forecastDay.properties.periods[3].temperature,
            },
            icon: faCoffee,
          },
          dayAfterTomorrow: {
            day: forecastDay.properties.periods[4].name,
            temp: {
              high: forecastDay.properties.periods[4].temperature,
              low: forecastDay.properties.periods[5].temperature,
            },
            description: forecastDay.properties.periods[4].shortForecast,
            icon: faCoffee,
          },
        });
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
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
          <div className="cards">
            <CardImage />
            <CardSmall
              className="card-small"
              title="Temp"
              value="30f"
              icon={faCoffee}
            />
            <CardMedium
              weatherForecast={weather}
              // todaysTemp={weather?.today?.temp || "NA"}
              // location="Mason City, IL"
              // todayIcon={faCoffee}
              // tomorrowIcon={faCoffee}
              // tomorrowTemp={weather?.tomorrow?.temp || "NA"}
              // tomorrowDescription={weather?.tomorrow?.description || "NA"}
              // dayAfterTomorrowIcon={faCoffee}
              // dayAfterTomorrowTemp={weather?.dayAfterTomorrow?.temp || "NA"}
              // dayAfterTomorrowDescription={
              //   weather?.dayAfterTomorrow.description || "NA"
              // }
            />
            <CardWeatherForecast
              weatherForecast={[
                { dayName: "wed", weatherIcon: faSun, high: "80", low: "20" },
                { dayName: "thurs", weatherIcon: faSun, high: "70", low: "20" },
                {
                  dayName: "friday",
                  weatherIcon: faSun,
                  high: "50",
                  low: "20",
                },
                {
                  dayName: "saturday",
                  weatherIcon: faSun,
                  high: "40",
                  low: "20",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
