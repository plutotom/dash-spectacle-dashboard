import React, { useState, useEffect } from "react";
// import "./../styles/timeAndDateCard.css";
// const dayOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const dayOfWeek = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

const style = `
.time-and-date-card-old {
    /* background-color: var(--text); */
     border: 1px solid var(--primary);
    /* max-width: fit-content; */
    max-width: var(--md-widget-width);
    min-width: var(--md-widget-width);
    max-height:var(--sm-widget-height);
    min-height:var(--sm-widget-height);
    padding: 10px;
    letter-spacing: 2px;
    text-align: center;
    margin: 10px;
  }
  
  .time-and-date-card-old .day {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .time-and-date-card-old .day p {
    padding-left: 10px;
  }
  .time-and-date-card-old h4 {
    text-transform: uppercase;
  }
  .time-and-date-card-old .time {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .time-and-date-card-old .time h4 {
    font-size: var(--fs-650);
  }
  
  /* ======from bing=========== */
  
  .timer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: auto;
  }
  
  .time-unit {
    margin: 0px 5px;
  }
  
  .time-unit span {
    font-size: 19px;
  }
  .time-unit label {
    font-size: 19px;
  }
  
  .time-unit label {
    display: block;
  }
  
  .time-underline {
    display: flex;
    justify-content: center;
    align-items: center;
    height: auto;
    width: 100%;
  }
  
`;

const TimeAndDateCardOld = () => {
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
    <div className="time-and-date-card-old">
      <div className="day">
        <h4 className="dayOfTheWeek">{dayOfTheWeek}</h4>
        <p> {date}</p>
      </div>
      <div className="time">
        <h4>{currentTime}</h4>
      </div>
      <style>{style}</style>
    </div>
  );
};

export default TimeAndDateCardOld;
