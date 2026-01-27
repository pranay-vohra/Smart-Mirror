import { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date());
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const interval = setInterval(() => {
        const now = new Date();

        // Basic validation: new time should move forward
        if (isNaN(now.getTime())) {
          setError("Clock unavailable");
        } else {
          setTime(now);
          setError(null);
        }
      }, 1000);

      return () => clearInterval(interval);
    } catch (e) {
      setError("Clock error");
    }
  }, []);

  // If clock fails, show fallback label instead of blank screen
  if (error) {
    return (
      <div style={{ opacity: 0.6, fontSize: "24px", textAlign: "center" }}>
        {error}
      </div>
    );
  }

  const weekday = time.toLocaleDateString(undefined, { weekday: "long" });
  const formattedDate = time.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <div style={{ fontSize: "22px", opacity: 0.7 }}>
        {weekday}, {formattedDate}
      </div>
      <div style={{ fontSize: "36px", fontWeight: 300 }}>
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
}
