import React, { useState, useEffect } from "react";
import "./../styles/timeAndDateCard.css";
let dayOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const TimeAndDateCard = () => {
  let [dayOfTheWeek, setDayOfTheWeek] = useState<string>(
    dayOfWeek[new Date().getDay()]
  );
  let [currentTime, setCurrentTime] = useState<string>(
    `${new Date().getHours()} • ${new Date().getMinutes()} • ${new Date().getSeconds()}`
  );
  let [date, setDate] = useState<any>(
    `${new Date().getMonth()} • ${new Date().getDate()} • ${new Date().getFullYear()}`
  );

  useEffect(() => {
    let dayOfWeekUpdate = setInterval(
      () => setDayOfTheWeek(dayOfWeek[new Date().getDay()]),
      // update every 12 hours
      1000 * 60 * 60 * 12
    );

    let dateUpdate = setInterval(
      () =>
        setDate(
          `${new Date().getFullYear()} • ${new Date().getMonth()} • ${new Date().getDate()}`
        ),
      // update every 4 hours
      1000 * 60 * 60 * 4
    );

    let timeUpdate = setInterval(
      () =>
        setCurrentTime(
          `${new Date().getHours()} • ${new Date().getMinutes()} • ${new Date().getSeconds()}`
        ),
      // updates every second
      1000
    );

    return function cleanup() {
      clearInterval(dayOfWeekUpdate);
      clearInterval(timeUpdate);
      clearInterval(dateUpdate);
    };
  });

  return (
    <div className="time-and-date-card">
      {/* <div className="day">
      
        <h4 className="dayOfTheWeek">{dayOfTheWeek}</h4>
        <p> {date}</p>
      </div>
      <div className="time">
        <h4>{currentTime}</h4>
      </div> */}
      <div className="timer">
        <div className="time-unit">
          <span id="days">FR</span>
          <label>DAY</label>
        </div>
        :
        <div className="time-unit">
          <span id="hours">13</span>
          <label>HOURS</label>
        </div>
        :
        <div className="time-unit">
          <span id="minutes">47</span>
          <label>MINUTES</label>
        </div>
        :
        <div className="time-unit">
          <span id="seconds">18</span>
          <label>SECONDS</label>
        </div>
      </div>
    </div>
  );
};

export default TimeAndDateCard;
