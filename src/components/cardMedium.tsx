import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/card.css";
export default function CardMedium(props: any) {
  return (
    <>
      <div className="card card-medium">
        <div className="medium-top">
          <div>
            <h3>{props.todaysTemp}</h3>
            <p className="location">
              {props.location ? props.location : "Mason City, IL"}
            </p>
          </div>
          <p className="medium-temp">H:68° L:45°</p>
          <div className="weatherIcon">
            <FontAwesomeIcon className="" icon={props.todayIcon} />
          </div>
        </div>
        <div className="medium-bottom">
          <div className="medium-row">
            <FontAwesomeIcon
              className="medium-icon"
              icon={props.tomorrowIcon}
            />
            <p className="card-small-title">
              {props.tomorrowTemp} {props.tomorrowDescription}
            </p>
          </div>
          <div className="medium-row">
            <FontAwesomeIcon
              className="medium-icon"
              icon={props.dayAfterTomorrowIcon}
            />
            <p className="card-small-paragraph">
              {props.dayAfterTomorrowTemp} {props.dayAfterTomorrowDescription}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
