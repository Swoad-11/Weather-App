import Page from "./Page";
import {
  FavoriteProvider,
  LocationProvider,
  SettingsProvider,
  ToastProvider,
  WeatherProvider,
} from "./provider";

function App() {
  return (
    <ToastProvider>
      <SettingsProvider>
        <LocationProvider>
          <WeatherProvider>
            <FavoriteProvider>
              <Page />
            </FavoriteProvider>
          </WeatherProvider>
        </LocationProvider>
      </SettingsProvider>
    </ToastProvider>
  );
}

export default App;
