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

  const [index, setIndex] = useState(0);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    if (hour >= 21 || hour < 5) return "Good night";
    return "Good morning";
  };

  useEffect(() => {
    // Always start with correct time-based greeting
    setIndex(affirmations.indexOf(getTimeGreeting()));

    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % affirmations.length);
    }, 30 * 60 * 1000); // 30 min

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      fontSize: "42px",
      fontWeight: 300,
      opacity: 0.85,
      textAlign: "center"
    }}>
      {affirmations[index]}
    </div>
  );
}
