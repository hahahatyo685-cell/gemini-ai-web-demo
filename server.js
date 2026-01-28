const express = require("express");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load env
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Validasi API KEY
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY belum ada di .env");
  process.exit(1);
}

// Init Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Route test (biar gak Cannot GET /)
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server hidup 🚀" });
});

// Generate text
app.post("/generate-text", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "Prompt kosong" });
    }

    console.log("➡️ PROMPT:", prompt);

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log("⬅️ JAWABAN:", text);

    res.json({ result: text });
  } catch (error) {
    console.error("❌ ERROR GEMINI:", error.message);
    res.status(500).json({
      error: "Gagal generate jawaban dari Gemini",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server jalan di http://localhost:${PORT}`);
});