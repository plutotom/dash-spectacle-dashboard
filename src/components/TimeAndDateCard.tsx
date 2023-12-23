import React, { useState, useEffect } from "react";
import "./../styles/timeAndDateCard.css";
// const dayOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const dayOfWeek = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

const TimeAndDateCard = () => {
  let [dayOfTheWeek, setDayOfTheWeek] = useState<string>(
    dayOfWeek[new Date().getDay()]
  );
  let [currentTime, setCurrentTime] = useState<any>(
    // `${new Date().getHours()} • ${new Date().getMinutes()} • ${new Date().getSeconds()}`
    {
      hour: new Date().getHours() % 12 || 12,
      minute: new Date().getMinutes(),
      second: new Date().getSeconds(),
    }
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
          // `${new Date().getHours()} • ${new Date().getMinutes()} • ${new Date().getSeconds()}`
          {
            hour: (new Date().getHours() % 12 || 12)
              .toString()
              .padStart(2, "0"),
            minute: new Date().getMinutes(),
            second: new Date().getSeconds(),
          }
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
      <div className="timer">
        <div className="time-unit">
          <p id="days">{dayOfTheWeek}</p>
          <label>DAY</label>
        </div>
        :
        <div className="time-unit">
          <p id="hours">{currentTime?.hour}</p>
          <label>HOURS</label>
        </div>
        :
        <div className="time-unit">
          <p id="minutes">{currentTime?.minute}</p>
          <label>MINUTES</label>
        </div>
        :
        <div className="time-unit">
          <p id="seconds">{currentTime?.second}</p>
          <label>SECONDS</label>
        </div>
      </div>
      {/* <hr className="time-underline"></hr> */}
    </div>
  );
};

export default TimeAndDateCard;
