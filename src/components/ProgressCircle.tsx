import "../styles/progressCircle.css";
import React from "react";

export default function ProgressCircle() {
  return (
    <div className="progress-circle-div">
      {/* <div className="progress-circle">
        <span
          className="title timer"
          data-from="0"
          data-to="85"
          data-speed="1800"
        >
          85
        </span>
        <div className="overlay"></div>
        <div className="left"></div>
        <div className="right"></div>
      </div> */}

      <div className="circular">
        <div className="inner"></div>
        <div className="outer"></div>
        <div className="numb">43%</div>
        <div className="circle">
          <div className="dot">
            <span></span>
          </div>
          <div className="bar left">
            <div className="progress"></div>
          </div>
          <div className="bar right">
            <div className="progress"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
