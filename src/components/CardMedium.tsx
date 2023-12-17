import React from "react";
import "../styles/card.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CardMedium({
  icon,
  title,
  cardText,
}: {
  icon: any;
  title: string;
  cardText: string;
}) {
  return (
    <div className="card card-medium">
      <FontAwesomeIcon icon={icon} />
      <p className="card-med-title">{title}</p>
      <p className="card-med-paragraph">{cardText}</p>
    </div>
  );
}
