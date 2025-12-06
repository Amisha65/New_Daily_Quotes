// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// FRONTEND_ORIGIN should match your dev server (vite) origin, e.g. http://localhost:5173
// server.js (replace the existing app.use(cors({...})) block with the code below)
// CORS FIX — safe for OPTIONS and works on Render + Vercel + Localhost
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

const allowedOrigins = [
  FRONTEND_ORIGIN, // production vercel URL
  "http://localhost:5173", // local dev
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow REST clients (curl/Postman) with no origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // ❗ DON'T THROW — just deny with false
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// HANDLE OPTIONS requests for all routes
app.options("*", cors());

app.use(express.json());

// Connect Mongo
connectDB(process.env.MONGO_URI);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/quotes", require("./routes/quotes"));

app.get("/", (req, res) => res.send("API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on " + PORT));
