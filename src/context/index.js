import { createContext, useContext } from "react";

const WeatherContext = createContext();
const FavoriteContext = createContext();
const LocationContext = createContext();
const SettingsContext = createContext();
const ToastContext = createContext();

export const useWeatherData = () => useContext(WeatherContext);
export const useFavorites = () => useContext(FavoriteContext);
export const useLocation = () => useContext(LocationContext);
export const useSettings = () => useContext(SettingsContext);
export const useToast = () => useContext(ToastContext);

export {
  WeatherContext,
  FavoriteContext,
  LocationContext,
  SettingsContext,
  ToastContext,
};
