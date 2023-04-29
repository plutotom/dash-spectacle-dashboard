import React, { useState, useEffect } from "react";
import banner from "../assets/codioful-formerly-gradienta-oPC-b39ZuzE-unsplash.jpg";
import banner2 from "../assets/looking-together.jpg";
import "./../styles/dashbaord.css";
import CardSmall from "./CardSmall";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import CardMedium from "./cardMedium";

export default function Dashboard() {
  const [long, setlong] = useState(-89.36973);
  const [lat, setLat] = useState(40.145934);
  
  // React.useEffect(() => {
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
          <div>
            <h1>content here</h1>
          </div>
          <div className="cards">
            <CardSmall
              className="card-small"
              title="Temp"
              value="30f"
              icon={faCoffee}
            />
            <CardMedium
              todaysTemp="30f"
              location="Mason City, IL"
              todayIcon={faCoffee}
              tomorrowIcon={faCoffee}
              tomorrowTemp="30f"
              tomorrowDescription="sunny"
              dayAfterTomorrowIcon={faCoffee}
              dayAfterTomorrowTemp="30f"
              dayAfterTomorrowDescription="sunny"
            />
          </div>
        </div>
      </div>
    </>
  );
}
