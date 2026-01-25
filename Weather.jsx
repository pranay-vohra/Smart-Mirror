import axios from "axios";
import { useEffect, useState } from "react";

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const API_KEY = "d32937130d459455270148237dab6cfc"; // replace with your key
  const CITY = "Delhi";

  useEffect(() => {
    fetchWeather();
    fetchForecast();
    const interval = setInterval(() => {
      fetchWeather();
      fetchForecast();
    }, 10 * 60 * 1000); // refresh every 10 min

    return () => clearInterval(interval);
  }, []);

  const fetchWeather = async () => {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
    );
    setWeather(res.data);
  };

  const fetchForecast = async () => {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}&units=metric`
    );

    // get next 3 days at 12:00pm
    const daily = res.data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);
    setForecast(daily);
  };

  if (!weather) return null;

  return (
    <div style={{ textAlign: "right" }}>
      <div style={{ fontSize: "48px", fontWeight: 300 }}>
        {Math.round(weather.main.temp)}°C
      </div>

      <div style={{ fontSize: "20px", opacity: 0.8 }}>
        New Delhi
      </div>

      <div style={{ fontSize: "14px", opacity: 0.6, marginTop: "4px" }}>
        {weather.weather[0].description}<br/>
        Humidity: {weather.main.humidity}%<br/>
        Wind: {weather.wind.speed} km/h
      </div>

      {/* 3-day forecast */}
      <div style={{
        display: "flex",
        gap: "28px",
        marginTop: "20px",
        fontSize: "14px",
        opacity: 0.7,
        justifyContent: "flex-end"
      }}>
        {forecast.map((day, idx) => (
          <div key={idx} style={{ textAlign: "center" }}>
            {new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: "short" })}<br/>
            {day.weather[0].main}<br/>
            {Math.round(day.main.temp)}°C
          </div>
        ))}
      </div>
    </div>
  );
}
