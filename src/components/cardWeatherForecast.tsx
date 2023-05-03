import "./../styles/card.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faSun } from "@fortawesome/free-solid-svg-icons";

const tempProps = [
  { dayName: "wed", weatherIcon: faSun, high: "80", low: "20" },
  { dayName: "thurs", weatherIcon: faSun, high: "70", low: "20" },
  { dayName: "friday", weatherIcon: faSun, high: "50", low: "20" },
  { dayName: "saturday", weatherIcon: faSun, high: "40", low: "20" },
];

interface weatherForecast {
  dayName: string;
  weatherIcon: IconProp;
  high: string;
  low: string;
}

// For this typescript syntax see this link for more info: https://www.pluralsight.com/guides/use-interface-props-in-functional-components-using-typescript-with-react
interface weatherForecastProps {
  weatherForecast: weatherForecast[];
}
const CardWeatherForecast: React.FC<weatherForecastProps> = ({
  weatherForecast,
}: weatherForecastProps) => {
  return (
    <>
      <div className="card card-weather-forecast">
        {weatherForecast.map((day, index, arr) => (
          <div className="forecastDay">
            <h3>{day.dayName}</h3>
            <FontAwesomeIcon icon={day.weatherIcon} />
            <p>
              {day.high}/{day.low}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};
export default CardWeatherForecast;
