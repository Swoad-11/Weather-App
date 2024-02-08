import Header from "./components/Header/Header";
import WeatherBoard from "./components/Weather/WeatherBoard";
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
          <div className="grid place-items-center h-screen">
            <Header />
            <main>
              <section>
                <WeatherBoard />
              </section>
            </main>
          </div>
        </FavoriteProvider>
      </WeatherProvider>
    </LocationProvider>
  );
}

export default App;
