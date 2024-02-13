import { useEffect, useState } from "react";
import { fetchWeather } from "./lib/weather";
import Hourly from "./components/Hourly";

function App() {
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [weather, setWeather] =
    useState<Awaited<ReturnType<typeof fetchWeather>>>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      (error) => {
        console.error("Error getting user location:", error);
      },
    );
  }, []);

  useEffect(() => {
    fetchWeather(location.latitude, location.longitude)
      .then((res) => setWeather(res))
      .catch((e) => console.error(e));
  }, [location]);

  return (
    <main className="flex justify-center p-6 flex-col items-center gap-6">
      {weather && (
        <>
          <ul>
            <li>Temp: {weather.current.temperature2m}</li>
            <li>Apparent Temp: {weather.current.apparentTemperature}</li>
            <li>Rain: {weather.current.rain}</li>
          </ul>

          <div className="flex justify-center">
            <Hourly hours={weather} />
          </div>
        </>
      )}
    </main>
  );
}

export default App;
