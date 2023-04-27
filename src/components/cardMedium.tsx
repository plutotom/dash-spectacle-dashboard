import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/card.css";
export default function CardMedium(props: any) {
  return (
    <>
      <div className="card card-medium">
        <div className="medium-top">
          <div>
            <h3>57°F</h3>
            <p className="location">
              {props.location ? props.location : "Mason City, IL"}
            </p>
          </div>
          <p className="medium-temp">H:68° L:45°</p>
        </div>
        <div className="medium-bottom">
          <div className="medium-row">
            <FontAwesomeIcon className="medium-icon" icon={props.icon} />
            <p className="card-small-title">{props.title}other content again</p>
          </div>
          <div className="medium-row">
            <FontAwesomeIcon className="medium-icon" icon={props.icon} />
            <p className="card-small-paragraph">
              {props.value}some other content
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
