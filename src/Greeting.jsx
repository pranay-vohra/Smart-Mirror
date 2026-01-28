import { useEffect, useState } from "react";

export default function Greeting() {
  const affirmations = [
    "You're doing amazing",
    "You are improving everyday",
    "Stay focused, progress is happening",
    "Breathe deeply, relax your mind",
    "Great things take time",
    "You're more capable than you think",
    "Make today count",
    "Believe in your skills",
    "Consistency beats intensity",
    "Be kind to yourself",
    "Your future self will thank you",
    "You are learning fast",
    "Keep building, keep improving",
    "Small steps are still progress",
    "Discipline creates freedom",
    "Success is a habit"
  ];

  const [affirmIndex, setAffirmIndex] = useState(() =>
    Math.floor(Math.random() * affirmations.length) // random start
  );
  const [error, setError] = useState(null);

  const getAffirmationSafe = (idx) => {
    try {
      if (!affirmations.length) throw new Error("No affirmations");
      return affirmations[idx] || affirmations[0];
    } catch (e) {
      setError("Affirmation unavailable");
      return "Stay positive";
    }
  };

  useEffect(() => {
    try {
      const interval = setInterval(() => {
        setAffirmIndex((prev) => {
          let r;
          do {
            r = Math.floor(Math.random() * affirmations.length);
          } while (r === prev); // prevent repeat
          return r;
        });
      }, 10 * 60 * 1000); // every 10 minutes

      return () => clearInterval(interval);
    } catch (e) {
      setError("Greeting error");
    }
  }, []);

  if (error) {
    return (
      <div style={{
        opacity: 0.7,
        fontSize: "24px",
        textAlign: "center",
        fontStyle: "italic"
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{
      fontSize: "30px",
      fontWeight: 300,
      opacity: 0.85,
      textAlign: "center"
    }}>
      {getAffirmationSafe(affirmIndex)}
    </div>
  );
}
