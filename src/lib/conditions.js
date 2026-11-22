import ClearSky from "../assets/backgrounds/clear-sky.jpg";
import Sunny from "../assets/backgrounds/sunny.jpg";
import FewClouds from "../assets/backgrounds/few-clouds.jpg";
import WhiteClouds from "../assets/backgrounds/white-clouds.jpg";
import ScatteredClouds from "../assets/backgrounds/scattered-clouds.jpg";
import Haze from "../assets/backgrounds/haze.jpg";
import Mist from "../assets/backgrounds/mist.jpeg";
import Winter from "../assets/backgrounds/winter.jpg";
import Rainy from "../assets/backgrounds/rainy-day.jpg";
import Shower from "../assets/backgrounds/shower-rain.jpg";
import Snow from "../assets/backgrounds/snow.jpg";
import Thunder from "../assets/backgrounds/thunderstorm.jpg";

/**
 * Maps an OpenWeather condition id to a background photo and an animated
 * effect layer. https://openweathermap.org/weather-conditions
 */
export function getCondition(id = 800, isDay = true) {
  if (id >= 200 && id < 300) return { bg: Thunder, fx: "thunder" };
  if (id >= 300 && id < 400) return { bg: Shower, fx: "drizzle" };
  if (id === 511 || (id >= 600 && id < 700)) return { bg: Snow, fx: "snow" };
  if (id >= 500 && id < 600) return { bg: Rainy, fx: "rain" };
  if (id === 701) return { bg: Mist, fx: "fog" };
  if (id === 741) return { bg: Winter, fx: "fog" };
  if (id > 700 && id < 800) return { bg: Haze, fx: "fog" };
  if (id === 800) return { bg: isDay ? Sunny : ClearSky, fx: isDay ? "sun" : "stars" };
  if (id === 801) return { bg: FewClouds, fx: isDay ? "clouds" : "stars" };
  if (id === 802) return { bg: WhiteClouds, fx: "clouds" };
  return { bg: ScatteredClouds, fx: "clouds" };
}

export const AQI = [
  null,
  { label: "Good", color: "#34d399", tip: "Air quality is great. Enjoy the outdoors." },
  { label: "Fair", color: "#a3e635", tip: "Acceptable for almost everyone." },
  { label: "Moderate", color: "#facc15", tip: "Sensitive groups should limit long outdoor effort." },
  { label: "Poor", color: "#fb923c", tip: "Consider shorter time outside and a mask." },
  { label: "Very poor", color: "#f87171", tip: "Avoid outdoor activity where you can." },
];
