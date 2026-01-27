import axios from "axios";
import { useEffect, useState } from "react";
import "./Weather_Enhanced.css";

export default function WeatherEnhanced({ city = "Delhi" }) {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "d32937130d459455270148237dab6cfc";

  // Weather icon mapping (MagicMirror style)
  const getWeatherIcon = (weatherMain, weatherId) => {
    // Using weather condition IDs for more precise icons
    // Reference: https://openweathermap.org/weather-conditions
    if (weatherId >= 200 && weatherId < 300) return "⛈️"; // Thunderstorm
    if (weatherId >= 300 && weatherId < 400) return "🌦️"; // Drizzle
    if (weatherId >= 500 && weatherId < 600) return "🌧️"; // Rain
    if (weatherId >= 600 && weatherId < 700) return "❄️"; // Snow
    if (weatherId >= 700 && weatherId < 800) {
      // Atmosphere
      if (weatherId === 701 || weatherId === 741) return "🌫️"; // Mist/Fog
      if (weatherId === 781) return "🌪️"; // Tornado
      return "🌫️";
    }
    if (weatherId === 800) return "☀️"; // Clear
    if (weatherId > 800) return "☁️"; // Clouds
    return "☁️";
  };

  useEffect(() => {
    const loadWeather = () => {
      fetchCurrentWeather();
      fetchForecast();
    };

    loadWeather();
    const interval = setInterval(loadWeather, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [city]);

  const fetchCurrentWeather = async () => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            q: city,
            appid: API_KEY,
            units: "metric",
          },
          timeout: 8000,
        }
      );
      setCurrent(res.data);
      setError(null);
      setLoading(false);
    } catch (e) {
      console.error("Current weather fetch failed:", e);
      setError("Weather temporarily unavailable");
      setLoading(false);
    }
  };

  const fetchForecast = async () => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast`,
        {
          params: {
            q: city,
            appid: API_KEY,
            units: "metric",
            cnt: 8, // Get 8 entries (24 hours, 3-hour intervals)
          },
          timeout: 8000,
        }
      );
      // Get next 3 forecast entries (9 hours ahead)
      setForecast(res.data.list.slice(0, 3));
      setError(null);
    } catch (e) {
      console.error("Forecast fetch failed:", e);
      setError("Forecast temporarily unavailable");
    }
  };

  // Format time for forecast
  const formatForecastTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) return null;

  if (error && !current) {
    return (
      <div className="weather-error">
        <div className="error-icon">⚠️</div>
        <div className="error-text">{error}</div>
      </div>
    );
  }

  if (!current) return null;

  const weatherIcon = getWeatherIcon(
    current.weather[0].main,
    current.weather[0].id
  );

  return (
    <div className="weather-module">
      {/* Current Weather Section */}
      <div className="weather-current">
        <div className="current-main">
          <div className="current-icon-large">{weatherIcon}</div>
          <div className="current-temp-large">
            {Math.round(current.main.temp)}°
          </div>
        </div>

        <div className="current-description">
          {current.weather[0].description}
        </div>

        <div className="current-details">
          <div className="detail-item">
            <span className="detail-label">Feels like</span>
            <span className="detail-value">
              {Math.round(current.main.feels_like)}°
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">💧 Humidity</span>
            <span className="detail-value">{current.main.humidity}%</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">💨 Wind</span>
            <span className="detail-value">
              {Math.round(current.wind.speed * 3.6)} km/h
            </span>
          </div>

          {current.main.pressure && (
            <div className="detail-item">
              <span className="detail-label">🌡️ Pressure</span>
              <span className="detail-value">{current.main.pressure} hPa</span>
            </div>
          )}
        </div>
      </div>

      {/* Forecast Section */}
      {forecast.length > 0 && (
        <div className="weather-forecast">
          <div className="forecast-header">Forecast</div>
          <div className="forecast-items">
            {forecast.map((item, idx) => (
              <div key={idx} className="forecast-item">
                <div className="forecast-time">
                  {formatForecastTime(item.dt)}
                </div>
                <div className="forecast-icon">
                  {getWeatherIcon(item.weather[0].main, item.weather[0].id)}
                </div>
                <div className="forecast-temp">
                  {Math.round(item.main.temp)}°
                </div>
                {item.pop > 0.2 && (
                  <div className="forecast-rain">
                    💧 {Math.round(item.pop * 100)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Location */}
      <div className="weather-location">{current.name}</div>

      {/* Error message (if data is stale but still showing) */}
      {error && (
        <div className="weather-status-message">
          <small>{error}</small>
        </div>
      )}
    </div>
  );
}