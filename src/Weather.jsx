import axios from "axios";
import { useEffect, useState } from "react";
import "./Weather.css";

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // STATIC LAYOUT CHOICE — DO NOT REMOVE
  const ACTIVE_LAYOUT = "A"; // "A" | "B" | "C"

  const API_KEY = process.env.REACT_APP_WEATHER_KEY;
  const LAT = process.env.REACT_APP_LAT;
  const LON = process.env.REACT_APP_LON;


  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const w = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`
      );

      const f = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`
      );


      setWeather(w.data);
      setForecast(f.data?.list?.slice(0, 3) || []);
      setError(null);
    } catch (e) {
      setError("Weather unavailable");
    } finally {
      setLoading(false);
    }
  };
  console.log({weather, forecast, error, API_KEY});
  console.log({ LAT, LON });


  // loading / error guard
  if (loading) return null;
  if (error || !weather) return null;

  // ===== day/night calculation =====
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour > 19;

  const baseIcons = {
    Thunderstorm: "wi-thunderstorm",
    Drizzle: "wi-sprinkle",
    Rain: "wi-rain",
    Snow: "wi-snow",
    Mist: "wi-fog",
    Smoke: "wi-smoke",
    Haze: "wi-day-haze",
    Dust: "wi-dust",
    Fog: "wi-fog",
    Sand: "wi-sandstorm",
    Ash: "wi-volcano",
    Squall: "wi-strong-wind",
    Tornado: "wi-tornado",
    Clouds: isNight ? "wi-night-alt-cloudy" : "wi-day-cloudy",
    Clear: isNight ? "wi-night-clear" : "wi-day-sunny"
  };

  const resolveIcon = (obj) => {
    if (!obj || !obj.weather || !obj.weather[0]) return "wi-cloudy";
    return baseIcons[obj.weather[0].main] || "wi-cloudy";
  };

  // ===== LAYOUT A =====
  const layoutA = (
    <div className="weather-root layout-A">
      <div className="mm-temp-row">
        <i className={`wi mm-icon ${resolveIcon(weather)}`} />
        <span className="mm-temp">{Math.round(weather.main.temp)}°C</span>
      </div>

      <div className="mm-main-text">{weather.weather[0].main}</div>
      <div className="mm-feels">
        Feels like {Math.round(weather.main.feels_like)}°C
      </div>

      <div className="mm-sun">
        <span>🌅 {new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: false})}</span>
        &nbsp;&nbsp;
        <span>🌇 {new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: false})}</span>
      </div>

      <div className="mm-forecast-row">
        {forecast.map((x, i) => (
          <div className="mm-forecast-col" key={i}>
            <i className={`wi mm-f-icon ${resolveIcon(x)}`} />
            <div className="mm-f-time">
              {new Date(x.dt * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
              })}
            </div>
            <div className="mm-f-temp">
              {Math.round(x.main.temp)}°C
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ===== LAYOUT B =====
  const layoutB = (
    <div className="weather-root layout-B">
      <div className="mm-temp-row">
        <i className={`wi mm-icon-sm ${resolveIcon(weather)}`} />
        <span className="mm-temp">{Math.round(weather.main.temp)}°C</span>
      </div>

      <div className="mm-main-text-sm">{weather.weather[0].main}</div>
      <div className="mm-feels-sm">
        Feels like {Math.round(weather.main.feels_like)}°C
      </div>

      <div className="mm-forecast-row-sm">
        {forecast.map((x, i) => (
          <div className="mm-col-sm" key={i}>
            <i className={`wi mm-f-icon-sm ${resolveIcon(x)}`} />
            <div className="mm-time-sm">
              {new Date(x.dt * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
              })}
            </div>
            <div className="mm-temp-sm">
              {Math.round(x.main.temp)}°C
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ===== LAYOUT C =====
  const layoutC = (
    <div className="weather-root layout-C">
      <div className="mm-temp-c">{Math.round(weather.main.temp)}°C</div>
      <div className="mm-main-c">{weather.weather[0].main}</div>
      <div className="mm-feels-c">
        Feels like {Math.round(weather.main.feels_like)}°C
      </div>

      <div className="mm-forecast-c">
        {forecast.map((x, i) => (
          <div key={i}>
            {new Date(x.dt * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            })}{" "}
            <i className={`wi mm-f-icon-c ${resolveIcon(x)}`} />{" "}
            {Math.round(x.main.temp)}°C
          </div>
        ))}
      </div>
    </div>
  );

  // RETURN STATIC
  if (ACTIVE_LAYOUT === "A") return layoutA;
  if (ACTIVE_LAYOUT === "B") return layoutB;
  if (ACTIVE_LAYOUT === "C") return layoutC;
  return layoutA; // fallback
}
