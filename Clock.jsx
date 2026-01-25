import { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const weekday = time.toLocaleDateString(undefined, { weekday: "long" });
  const formattedDate = time.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <div style={{ fontSize: "36px", fontWeight: 300 }}>
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit"})}
      </div>
      <div style={{ fontSize: "22px", opacity: 0.7 }}>
        {weekday}, {formattedDate}
      </div>
    </div>
  );
}
