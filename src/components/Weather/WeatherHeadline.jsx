import { useContext } from "react";
import pin from "../../assets/pin.svg";
import { WeatherContext } from "../../context";
import { getFormattedDate } from "../../utils/dateUtil";

import {
  cloudIcon1d,
  cloudIcon1n,
  cloudIcon2,
  cloudIcon3,
  hazeIcon,
  dayIcon,
  nightIcon,
  rainIconD,
  rainIconN,
  snowIcon,
  thunderIcon,
  drizzleIcon,
} from "../../assets/index";

export default function WeatherHeadline() {
  const { weatherData } = useContext(WeatherContext);
  const { id, temperature, location, time } = weatherData;

  function weatherIcon(id, time) {
    const isDay =
      getFormattedDate(time, "time", false).includes("AM") ||
      (getFormattedDate(time, "time", false) >= "06:00" &&
        getFormattedDate(time, "time", false) <= "18:00");
    switch (id) {
      case 801:
        return isDay ? cloudIcon1d : cloudIcon1n;
      case 802:
        return cloudIcon2;
      case 803:
      case 804:
        return cloudIcon3;
      case 800:
        return isDay ? dayIcon : nightIcon;
      case 700:
      case 711:
      case 721:
      case 731:
      case 741:
      case 751:
      case 761:
      case 762:
      case 771:
      case 781:
        return hazeIcon;
      case 300:
      case 301:
      case 302:
      case 310:
      case 311:
      case 312:
      case 313:
      case 314:
      case 321:
      case 520:
      case 521:
      case 522:
      case 531:
        return drizzleIcon;
      case 500:
      case 501:
      case 502:
      case 503:
      case 504:
        return isDay ? rainIconD : rainIconN;
      case 200:
      case 201:
      case 202:
      case 210:
      case 211:
      case 212:
      case 221:
      case 230:
      case 231:
      case 232:
        return thunderIcon;
      case 511:
      case 600:
      case 601:
      case 602:
      case 611:
      case 612:
      case 613:
      case 615:
      case 616:
      case 620:
      case 621:
      case 622:
        return snowIcon;
      default:
        return dayIcon;
    }
  }

  return (
    <>
      <div>
        <div className="max-md:flex items-center justify-between md:-mt-10">
          <img src={weatherIcon(id, time)} alt="cloud" />
          <div className="max-md:flex items-center max-md:space-x-4">
            <h1 className="text-[60px] lg:text-[80px] xl:text-[100px] leading-none md:mb-4">
              {Math.round(temperature)}°
            </h1>
            <div className="flex items-center space-x-4 md:mb-4">
              <img src={pin} />
              <h2 className="text-2xl lg:text-[50px]">{location}</h2>
            </div>
          </div>
        </div>
        <p className="text-sm lg:text-lg">
          {getFormattedDate(time, "time", false)} -{" "}
          {getFormattedDate(time, "date", false)}
        </p>
      </div>
    </>
  );
}
