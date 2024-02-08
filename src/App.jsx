import Page from "./Page";
import {
  WeatherProvider,
  FavoriteProvider,
  LocationProvider,
} from "./provider";
function App() {
  return (
    <LocationProvider>
      <WeatherProvider>
        <FavoriteProvider>
          <Page />
        </FavoriteProvider>
      </WeatherProvider>
    </LocationProvider>
  );
}

export default App;
