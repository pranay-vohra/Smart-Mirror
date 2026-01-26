import Clock from "./Clock";
import Weather from "./Weather";
import Greeting from "./Greeting";

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
      <div style={{ position: "absolute", top: 30, right: 30 }}>
        <Weather city="New Delhi" />
      </div>

      {/* Greeting lower center */}
      <div style={{
        position: "absolute",
        bottom: 150,
        left: "50%",
        transform: "translateX(-50%)",
      }}>
        <Greeting />
      </div>

      {/* Bottom-left supervisors */}
      <div style={{
        position: "absolute",
        bottom: 30,
        left: 30,
        fontSize: "18px",
        opacity: 0.6
      }}>
        Supervised by : Dr. Safina Shokeen & Mr. Anil Tondon heheh
      </div>

      {/* Bottom-right credits */}
      <div style={{
        position: "absolute",
        bottom: 30,
        right: 30,
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
