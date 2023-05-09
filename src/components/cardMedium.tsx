import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/card.css";
import { weather } from "../shared/types/types";

export default function CardMedium({ weatherForecast }: any) {
  console.log(weatherForecast, "medumn");
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
              Tomorrow: {weatherForecast.tomorrowTemp}{" "}
              {weatherForecast.tomorrow.description}
            </p>
          </div>
          <div className="medium-row">
            <FontAwesomeIcon
              className="medium-icon"
              icon={weatherForecast.dayAfterTomorrow.icon}
            />
            <p className="card-small-paragraph">
              Day After Tomorrow: {weatherForecast.dayAfterTomorrow.temp.high}
              {"/"}
              {weatherForecast.dayAfterTomorrow.temp.low}
              {weatherForecast.dayAfterTomorrowDescription}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
