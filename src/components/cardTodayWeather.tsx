import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/card.css";
import { weather } from "../shared/types/types";

export default function CardTodayWeather({ weatherForecast }: any) {
  return (
    <>
      <div className="card card-medium">
        <div className="medium-top">
          <div>
            <h3>{weatherForecast.today.temp.high}</h3>
            <p className="location">
              {weatherForecast.location
                ? weatherForecast.location
                : "Mason City, IL"}
            </p>
          </div>
          <p className="medium-temp">
            H:{weatherForecast.today.temp.high}° L:
            {weatherForecast.today.temp.low}°
          </p>
          <div className="weatherIcon">
            <FontAwesomeIcon className="" icon={weatherForecast.today.icon} />
          </div>
        </div>
        <div className="medium-bottom">
          <div className="medium-row">
            <FontAwesomeIcon
              className="medium-icon"
              icon={weatherForecast.tomorrow.icon}
            />
            <p className="card-small-title">
              {weatherForecast.tomorrow.day}:{" "}
              {weatherForecast.tomorrow.temp.high}°{"/"}
              {weatherForecast.tomorrow.temp.low}°
            </p>
          </div>
          <div className="medium-row">
            <FontAwesomeIcon
              className="medium-icon"
              icon={weatherForecast.dayAfterTomorrow.icon}
            />
            <p className="card-small-paragraph">
              {weatherForecast.dayAfterTomorrow.day}:{" "}
              {weatherForecast.dayAfterTomorrow.temp.high}°{"/"}
              {weatherForecast.dayAfterTomorrow.temp.low}°
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
