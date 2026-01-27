import axios from "axios";
import { useEffect, useState } from "react";

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "d32937130d459455270148237dab6cfc";
  const CITY = "Delhi";

  const iconMap = {
    Thunderstorm: "⛈",
    Drizzle: "🌦",
    Rain: "🌧",
    Snow: "🌨",
    Mist: "🌫",
    Smoke: "🌫",
    Haze: "🌫",
    Dust: "🌫",
    Fog: "🌫",
    Sand: "🌫",
    Ash: "🌫",
    Squall: "💨",
    Tornado: "🌪",
    Clear: "☀️",
    Clouds: "☁️",
  };

  useEffect(() => {
    const load = () => {
      fetchWeather();
      fetchForecast();
    };
    load();

    const interval = setInterval(() => {
      load();
    }, 10 * 60 * 1000); // retry every 10 mins

    return () => clearInterval(interval);
  }, []);

  const fetchWeather = async () => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`,
        { timeout: 6000 }
      );
      setWeather(res.data);
      setError(null);
      setLoading(false);
    } catch (e) {
      console.warn("Weather fetch failed:", e);
      setError("⚠ Weather unavailable — retrying...");
      setLoading(false);
    }
  };

  const fetchForecast = async () => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}&units=metric`,
        { timeout: 6000 }
      );
      setForecast(res.data.list.slice(0, 3));
      setError(null);
    } catch (e) {
      console.warn("Forecast fetch failed:", e);
      setError("⚠ Forecast unavailable — retrying...");
    }
  };

  // === STATE HANDLING === //

  if (loading) return null; // no flicker on startup

  if (error && !weather) {
    return (
      <div style={{
        position: "absolute",
        right: "80px",
        top: "120px",
        color: "white",
        opacity: 0.85,
        textAlign: "center",
      }}>
        {error}
      </div>
    );
  }

  if (!weather) return null;

  const icon = iconMap[weather.weather[0].main] || "☁️";

  return (
    <div style={{
      position: "absolute",
      right: "35px",
      top: "10px",
      textAlign: "center",
      opacity: 0.85,
      fontWeight: 300,
      transform: "scale(0.8)",
      transformOrigin: "top right"
    }}>

      {/* CURRENT */}
      <div style={{ fontSize: "48px" }}>{icon}</div>
      <div style={{ fontSize: "68px" }}>{Math.round(weather.main.temp)}°C</div>

      <div style={{ fontSize: "20px", marginTop: "6px" }}>
        {weather.weather[0].main}
      </div>

      <div style={{ fontSize: "18px", marginTop: "4px", opacity: 0.8 }}>
        Feels like {Math.round(weather.main.feels_like)}°C
      </div>

      {/* FORECAST GRID */}
      <div style={{
        display: "flex",
        gap: "28px",
        marginTop: "28px",
        justifyContent: "center"
      }}>
        {forecast.map((item, idx) => (
          <div key={idx} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "32px" }}>
              {iconMap[item.weather[0].main] || "☁️"}
            </div>
            <div style={{ fontSize: "16px", marginTop: "2px" }}>
              {new Date(item.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
            </div>
            <div style={{ fontSize: "16px", marginTop: "2px" }}>
              {Math.round(item.main.temp)}°C
            </div>
          </div>
        ))}
      </div>

      {/* Show error but do NOT break visuals */}
      {error && (
        <div style={{ fontSize: 14, marginTop: 8, opacity: 0.7 }}>
          {error}
        </div>
      )}

    </div>
  );
}
