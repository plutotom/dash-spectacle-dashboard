import React from "react";
import "../styles/card.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CardSmall(props: any) {
  return (
    <div className="card card-small">
      <FontAwesomeIcon icon={props.icon} />
      <p className="card-title">{props.title}</p>
      <p className="card-paragraph">{props.value}</p>
    </div>
  );
}
