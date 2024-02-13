import { fetchWeather } from "../lib/weather";

type Hours = Pick<Awaited<ReturnType<typeof fetchWeather>>, "hourly">;

export default function Hourly({ hours }: { hours: Hours }) {
  const temperatures = Array.from(hours.hourly.temperature2m);
  const rain = hours.hourly.rain;

  return (
    <>
      <div className="flex gap-1 overflow-x-auto max-w-[90%] justify-center h-bar">
        {temperatures.map((temperature, index) => (
          <Hour key={index} n={temperature} index={index} rain={rain[index]} />
        ))}
      </div>
    </>
  );
}

function Hour({ n, index, rain }: { n: number; index: number; rain: number }) {
  return (
    <>
      <div className="p-3 flex flex-col bg-secondary-content rounded-lg min-w-20 items-center">
        <span className="flex justify-center mb-2">{index + 1}:00</span>
        <span className="font-semibold text-lg">{n.toFixed(0)}°C</span>
        <span className="font-semibold text-lg">{rain}%</span>
      </div>
    </>
  );
}
