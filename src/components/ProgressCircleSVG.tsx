import "../styles/progressCircleSVG.css";
import React, { useState, useEffect, useRef } from "react";

export default function ProgressCircleSVG() {
  const [progress, setProgress] = useState({
    currentPercentProgress: 25.3,
    maxPercentProgress: 1000,
  });

  const size = 150;
  // const progress = 46;
  const trackWidth = 10;
  const trackColor = `#ddd`;
  const indicatorWidth = 10;
  const indicatorColor = `#07c`;
  const indicatorCap = `round`;
  const label = `Loading...`;
  const labelColor = `#333`;
  const spinnerMode = false;
  const spinnerSpeed = 1;
  const center = size / 2,
    radius =
      center - (trackWidth > indicatorWidth ? trackWidth : indicatorWidth),
    dashArray = 2 * Math.PI * radius,
    dashOffset = dashArray * ((100 - progress.currentPercentProgress) / 100);

  const handleProgressChange = (e: any) => {
    setProgress({
      currentPercentProgress: progress.currentPercentProgress + 10,
      maxPercentProgress: 1000,
    });
  };

  return (
    <>
      <div className="svg-pi-wrapper" style={{ width: size, height: size }}>
        <svg
          onClick={handleProgressChange}
          className="svg-pi"
          style={{ width: size, height: size }}
        >
          <circle
            className="svg-pi-track"
            cx={center}
            cy={center}
            fill="transparent"
            r={radius}
            stroke={trackColor}
            strokeWidth={trackWidth}
          />
          <circle
            className={`svg-pi-indicator ${
              spinnerMode ? "svg-pi-indicator--spinner" : ""
            }`}
            style={{ animationDuration: `${spinnerSpeed * 1000}ms` }}
            cx={center}
            cy={center}
            fill="transparent"
            r={radius}
            stroke={indicatorColor}
            strokeWidth={indicatorWidth}
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap={indicatorCap}
          />
        </svg>
      </div>
    </>
  );
}
