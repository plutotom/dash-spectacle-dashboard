import React from "react";
import banner from "../assets/codioful-formerly-gradienta-oPC-b39ZuzE-unsplash.jpg";
import "./../styles/dashbaord.css";
import CardSmall from "./CardSmall";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
export default function Dashboard() {
  return (
    <>
      <div className="dash-container">
        <div
          className="dash-banner"
          // style={{ backgroundImage: "url ('urlhere'" }}
          style={{ backgroundImage: `url(${banner})` }}
        >
          <h1>Dashboard banner</h1>
        </div>
        {/* <img src={`${banner}`} alt="diannal lines background" /> */}
        <div className="dash-content">
          <div>
            <h1>content here</h1>
          </div>
          <div className="cards">
            <CardSmall className="card-small" title="Temp" value="30f" icon={faCoffee} />
            <CardSmall className="card-small" title="Temp" value="30f" icon={faCoffee} />
            <CardSmall className="card-small" title="Temp" value="30f" icon={faCoffee} />
          </div>
        </div>
      </div>
    </>
  );
}
