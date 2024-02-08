import { useContext, useEffect, useState } from "react";
import Header from "./components/header/Header";
import WeatherBoard from "./components/weather/WeatherBoard";

import { WeatherContext } from "./context";

import ClearSkyImage from "./assets/backgrounds/clear-sky.jpg";
import WhiteClouds from "./assets/backgrounds/white-clouds.jpg";
import FewCloudsImage from "./assets/backgrounds/few-clouds.jpg";
import HazeImage from "./assets/backgrounds/haze.jpg";
import MistImage from "./assets/backgrounds/mist.jpeg";
import RainyDayImage from "./assets/backgrounds/rainy-day.jpg";
import ScatterdCloudsImage from "./assets/backgrounds/scattered-clouds.jpg";
import SnowImage from "./assets/backgrounds/sunny.jpg";
import ThunderStormImage from "./assets/backgrounds/thunderstorm.jpg";
import WinterImage from "./assets/backgrounds/winter.jpg";

function Page() {
  const { weatherData, loading } = useContext(WeatherContext);
  const [climateImage, setClimateImage] = useState("");

  function getBackgroundImage(climate) {
    switch (climate) {
      case 500:
      case 501:
      case 502:
      case 503:
      case 504:
        return RainyDayImage;
      case 801:
        return FewCloudsImage;
      case 803:
      case 804:
        return ScatterdCloudsImage;
      case 802:
        return WhiteClouds;
      case 800:
        return ClearSkyImage;
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
        return SnowImage;
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
        return ThunderStormImage;
      case 741:
        return WinterImage;
      case 711:
      case 721:
      case 731:
      case 751:
      case 761:
      case 762:
      case 771:
      case 781:
        return HazeImage;
      case 701:
        return MistImage;
      default:
        return ClearSkyImage;
    }
  }

  useEffect(() => {
    const bgImage = getBackgroundImage(weatherData.id);
    setClimateImage(bgImage);
  }, [weatherData.id]);
  return (
    <>
      {loading.state ? (
        <div className="flex bg-gray-200 rounded-md w-96 p-8 mt-14 mx-auto">
          <p className="text-center text-3xl text-black">{loading.message}</p>
        </div>
      ) : (
        <div
          style={{ backgroundImage: `url('${climateImage}')` }}
          className="grid place-items-center h-screen bg-no-repeat bg-cover"
        >
          <Header />
          <main>
            <section>
              <WeatherBoard />
            </section>
          </main>
        </div>
      )}
    </>
  );
}

export default Page;
