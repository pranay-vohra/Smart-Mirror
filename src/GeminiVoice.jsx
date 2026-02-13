import { useEffect, useRef, useState } from "react";

export default function GeminiVoice() {
  const recognitionRef = useRef(null);
  const shouldRestart = useRef(true);
  const isSpeaking = useRef(false);

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    // 🔥 Ensure voices load
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };

    recognition.onstart = () => {
      console.log("🎤 Mic started");
      setStatus("listening");
    };

    recognition.onerror = (e) => {
      console.log("Speech error:", e.error);
      if (e.error !== "aborted") {
        setError("Mic error: " + e.error);
      }
    };

    recognition.onend = () => {
      console.log("Mic ended");
      if (shouldRestart.current && !isSpeaking.current) {
        try {
          recognition.start();
        } catch {}
      }
    };

    recognition.onresult = async (event) => {
      const lastResult = event.results[event.results.length - 1];

      if (!lastResult.isFinal) return;

      const transcript = lastResult[0].transcript
        .toLowerCase()
        .trim();

      console.log("Heard:", transcript);

      if (!isWakeWord(transcript)) return;

      const query = extractCommand(transcript);

      shouldRestart.current = false;
      recognition.stop();
      setStatus("thinking");

      try {
        const res = await fetch("http://localhost:5000/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: query || "hello" }),
        });

        if (!res.ok) throw new Error("Server error");

        const data = await res.json();
        console.log("AI RESPONSE:", data);

        const reply = data.reply;
        if (!reply) throw new Error("No reply");

        setStatus("speaking");
        speak(cleanText(reply));

      } catch (err) {
        console.log("Fetch error:", err);
        setError("AI failed");
        restartListening();
      }
    };

    recognition.start();

    return () => {
      shouldRestart.current = false;
      recognition.stop();
    };
  }, []);

  // 🔥 Flexible wake detection
  const isWakeWord = (text) => {
    return (
      text.includes("mirror") ||
      text.includes("mera") ||
      text.includes("meera")
    );
  };

  const extractCommand = (text) => {
    return text
      .replace(/mirror|mera|meera/g, "")
      .trim();
  };

  // 🔊 FIXED SPEAK FUNCTION
  const speak = (text) => {
    isSpeaking.current = true;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const selectedVoice =
      voices.find(v => v.lang === "en-IN") ||
      voices.find(v => v.lang === "en-US");

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      console.log("🔊 Speaking started");
    };

    utterance.onend = () => {
      console.log("✅ Speaking ended");
      isSpeaking.current = false;
      setStatus("listening");
      restartListening();
    };

    utterance.onerror = (e) => {
      console.log("Speech error:", e);
      isSpeaking.current = false;
      restartListening();
    };

    window.speechSynthesis.speak(utterance);
  };

  const restartListening = () => {
    shouldRestart.current = true;
    setStatus("listening");
    try {
      recognitionRef.current.start();
    } catch {}
  };

  const cleanText = (text) => {
    return text
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/#/g, "")
      .replace(/\n/g, " ")
      .replace(/_/g, "")
      .trim();
  };

  return (
    <div style={{ textAlign: "center", opacity: 0.8 }}>
      {status === "listening" && <div>🎤 Listening...</div>}
      {status === "thinking" && <div>🤔 Thinking...</div>}
      {status === "speaking" && <div>🗣 Speaking...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
