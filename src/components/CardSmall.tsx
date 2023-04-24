import React from "react";
import "../styles/cardSmall.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CardSmall(props: any) {
  return (
    <div className="card-small">
      <FontAwesomeIcon icon={props.icon} />
      <p className="card-small-title">{props.title}</p>
      <p className="card-small-paragraph">{props.value}</p>
    </div>
  );
}
