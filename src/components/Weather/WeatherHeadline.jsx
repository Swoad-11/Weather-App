import { useContext } from "react";
import pin from "../../assets/pin.svg";
import { WeatherContext } from "../../context";
import { getFormattedDate } from "../../utils/dateUtil";

import cloudIcon from "../../assets/cloud.svg";
import hazeIcon from "../../assets/haze.svg";
import sunIcon from "../../assets/sun.svg";
import rainIcon from "../../assets/rainy.svg";
import thunderIcon from "../../assets/thunder.svg";
import snowIcon from "../../assets/snow.svg";

export default function WeatherHeadline() {
  const { weatherData } = useContext(WeatherContext);
  const { climate, temperature, location, time } = weatherData;

  function weatherIcon(climate) {
    switch (climate) {
      case "Clouds":
        return cloudIcon;
      case "Clear":
        return sunIcon;
      case "Haze":
        return hazeIcon;
      case "Fog":
        return hazeIcon;
      case "Mist":
        return hazeIcon;
      case "Rain":
        return rainIcon;
      case "Thunderstorm":
        return thunderIcon;
      case "Snow":
        return snowIcon;
      default:
        return sunIcon;
    }
  }

  return (
    <>
      <div>
        <div className="max-md:flex items-center justify-between md:-mt-10">
          <img src={weatherIcon(climate)} alt="cloud" />
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
