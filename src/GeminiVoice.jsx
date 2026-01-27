import { useState } from "react";

export default function GeminiVoice() {
  const [listening, setListening] = useState(false);

  return (
    <div style={{
      textAlign: "center",
      marginBottom: "20px",
      opacity: listening ? 1 : 0.8
    }}>
      <button
        onClick={() => setListening(!listening)}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          fontSize: "26px",
          cursor: "pointer",
          background: listening ? "#ff3e3e" : "#555",
          color: "white"
        }}
      >
        🎙️
      </button>
      {/* Response output (for later) */}
      {/* <div style={{ marginTop: 10 }}>{response}</div> */}
    </div>
  );
}
