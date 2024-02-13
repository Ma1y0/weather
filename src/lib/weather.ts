import { fetchWeatherApi } from "openmeteo";

function range(start: number, stop: number, step: number) {
  return Array.from(
    { length: (stop - start) / step },
    (_, i) => start + i * step,
  );
}

export async function fetchWeather(latitude: number, longitude: number) {
  const params = {
    latitude,
    longitude,
    current: ["temperature_2m", "apparent_temperature", "rain"],
    hourly: ["temperature_2m", "rain"],
    forecast_days: 1,
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  // Helper function to form time ranges

  // Process first location. Add a for-loop for multiple locations or weather models
  const response = responses[0];

  // Attributes for timezone and location
  const utcOffsetSeconds = response.utcOffsetSeconds();

  const current = response.current()!;
  const hourly = response.hourly()!;

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature2m: current.variables(0)!.value(),
      apparentTemperature: current.variables(1)!.value(),
      rain: current.variables(2)!.value(),
    },
    hourly: {
      time: range(
        Number(hourly.time()),
        Number(hourly.timeEnd()),
        hourly.interval(),
      ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
      temperature2m: hourly.variables(0)!.valuesArray()!,
      rain: hourly.variables(1)!.valuesArray()!,
    },
  };

  return weatherData;
}
