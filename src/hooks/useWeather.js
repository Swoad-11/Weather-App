import { useContext, useEffect, useState } from "react";
import { LocationContext } from "../context";

const useWeather = () => {
  const [weatherData, setWeatherData] = useState({
    location: "",
    climate: "",
    temperature: "",
    maxTemperature: "",
    minTemperature: "",
    humidity: "",
    cloudPercentage: "",
    icon: "",
    wind: "",
    time: "",
    timeZone: "",
    sunrise: "",
    sunset: "",
    longitude: "",
    latitude: "",
  });

  const [loading, setLoading] = useState({
    state: false,
    message: "",
  });

  const [error, setError] = useState(null);

  const { selectedLocation } = useContext(LocationContext);

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      setLoading({
        ...loading,
        state: true,
        message: "Loading weather data...",
      });

      let apiUrl;
      if (selectedLocation && selectedLocation !== "") {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${selectedLocation}&appid=${
          import.meta.env.VITE_WEATHER_API_KEY
        }&units=metric`;
      } else {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${
          import.meta.env.VITE_WEATHER_API_KEY
        }&units=metric`;
      }
      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorMessage = `Failed to fetch weather data: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();

      const updateWeather = {
        ...weatherData,
        location: data?.name,
        climate: data?.weather[0]?.description,
        id: data?.weather[0]?.id,
        temperature: data?.main?.temp,
        maxTemperature: data?.main?.temp_max,
        minTemperature: data?.main?.temp_min,
        humidity: data?.main?.humidity,
        cloudPercentage: data?.clouds?.all,
        icon: data?.weather[0]?.icon,
        wind: data?.wind?.speed,
        time: data?.dt,
        timeZone: data?.timezone,
        sunrise: data?.sys?.sunrise,
        sunset: data?.sys?.sunset,
        longitude: longitude,
        latitude: latitude,
      };
      setWeatherData(updateWeather);
    } catch (error) {
      setError(error);
    } finally {
      setLoading({
        ...loading,
        state: false,
        message: "",
      });
    }
  };

  useEffect(() => {
    setLoading({
      ...loading,
      state: true,
      message: "Finding your location...",
    });

    navigator.geolocation.getCurrentPosition(function (position) {
      fetchWeatherData(position.coords.latitude, position.coords.longitude);
    });
  }, [selectedLocation]);

  return { weatherData, loading, error };
};

export default useWeather;
