import Clock from "./Clock";
import Weather from "./Weather";
import Greeting from "./Greeting";
import GeminiVoice from "./GeminiVoice";

function App() {
  return (
    <div style={{
      background: "black",
      color: "white",
      height: "100vh",
      width: "100vw",
      position: "relative",
      fontFamily: "sans-serif",
      boxSizing: "border-box",
      padding: "30px"
    }}>

      {/* Top-left time */}
      <div style={{ position: "absolute", top: 30, left: 30 }}>
        <Clock />
      </div>

      {/* Top-center VIPS-TC */}
      <div style={{
        position: "absolute",
        top: 30,
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "32px",
        opacity: 0.6,
        color:"red"
      }}>
        VIPS-TC
      </div>

      {/* Top-right weather */}
      {/*<div
        style={{
          position: "absolute",
          top: "5px",
          right: "2px",
          transform: "scale(0.70)",
          transformOrigin: "top right",
        }}
      >
        <Weather city="New Delhi" />
      </div>*/}
      
      <Weather />

      {/* GEMINI VOICE SECTION */}
      <div style={{
        position: "absolute",
        bottom: "150px",       // adjust freely
        left: "50%",
        transform: "translateX(-50%)",
        textAlign: "center",
        width: "300px",     // so text doesn’t stretch
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }}>
        <GeminiVoice />
      </div>

      {/* Greeting lower center */}
      <div style={{
        position: "absolute",
        bottom: "90px",
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "36px"
      }}>
        <Greeting />
      </div>

      {/* Bottom-right supervisors */}
      <div style={{
        position: "absolute",
        bottom: 30,
        right: 30,
        fontSize: "18px",
        opacity: 0.6
      }}>
        Supervised by : Dr. Safina Shokeen & Mr. Anil Tondon
      </div>

      {/* Bottom-left credits */}
      <div style={{
        position: "absolute",
        bottom: 30,
        left: 30,
        fontSize: "18px",
        opacity: 0.6,
        textAlign: "right"
      }}>
        Project by : Pranay Vohra , Nandini Y & Aishna Jain
      </div>
    </div>
  );
}

export default App;
