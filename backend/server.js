import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log("GEMINI KEY EXISTS:", !!GEMINI_API_KEY);
console.log("GEMINI KEY LENGTH:", GEMINI_API_KEY?.length);

// -----------------------------
// ROOT CHECK
// -----------------------------
app.get("/", (req, res) => {
  res.send("✅ Gemini AI Backend Running");
});

// -----------------------------
// TEST ROUTE
// Open in browser:
// http://localhost:5000/test-ai
// -----------------------------
app.get("/test-ai", async (req, res) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: "Say hello in a friendly way" }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data.candidates) {
      console.error("Gemini RAW ERROR:", data);
      return res.json({ error: data });
    }

    const reply =
      data.candidates[0]?.content?.parts[0]?.text || "No response";

    res.json({ reply });

  } catch (err) {
    console.error("TEST AI ERROR:", err);
    res.status(500).json({ error: "AI test failed" });
  }
});

// -----------------------------
// MAIN AI ROUTE (POST)
// Called from React
// -----------------------------
app.post("/api/ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data.candidates) {
      console.error("Gemini RAW ERROR:", data);
      return res.status(500).json({ error: "AI failed" });
    }

    const reply =
      data.candidates[0]?.content?.parts[0]?.text ||
      "I couldn't generate a response.";

    res.json({ reply });

  } catch (err) {
    console.error("Gemini ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------
app.listen(PORT, () => {
  console.log(`🚀 Gemini AI server running on port ${PORT}`);
});
