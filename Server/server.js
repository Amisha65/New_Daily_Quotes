// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// FRONTEND_ORIGIN should match your dev server (vite) origin, e.g. http://localhost:5173
// server.js (replace the existing app.use(cors({...})) block with the code below)

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

// allow both production (from env) and local dev
const allowedOrigins = [
  FRONTEND_ORIGIN, // e.g. https://new-daily-quotes.vercel.app (set on Render)
  "http://localhost:5173", // Vite dev server
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (e.g. curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(
        new Error("CORS policy violation: origin not allowed"),
        false
      );
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());

// Connect Mongo
connectDB(process.env.MONGO_URI);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/quotes", require("./routes/quotes"));

app.get("/", (req, res) => res.send("API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on " + PORT));
