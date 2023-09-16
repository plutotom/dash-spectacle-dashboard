import React from "react";
import "../styles/card.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CardMedium(props: any) {
  return (
    <div className="card card-medium">
      <FontAwesomeIcon icon={props.icon} />
      <p className="card-med-title">{props.title}</p>
      <p className="card-med-paragraph">{props.value}</p>
    </div>
  );
}
