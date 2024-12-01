require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const PORT = process.env.PORT || 5000;
const app = express();

const API_URL = "https://v6.exchangerate-api.com/v6/";
const API_KEY = process.env.EXCHANGE_RATE_API_KEY;

// Rate limiter to prevent abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Dynamically configure CORS based on environment
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://currency-converter-two-bice.vercel.app", // Vercel frontend URL
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not allowed by CORS")); // Block the request
    }
  },
};

//! Middleware setup
app.use(express.json()); // Parse JSON requests
app.use(apiLimiter); // Apply rate limiting
app.use(cors(corsOptions)); // Enable CORS

//! Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.message || "An error occurred");
  res.status(500).json({ message: error.message || "Internal Server Error" });
});

//! Currency conversion route
app.post("/api/convert", async (req, res) => {
  try {
    const { from, to, amount } = req.body;

    if (!from || !to || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Construct API URL for conversion
    const url = `${API_URL}${API_KEY}/pair/${from}/${to}/${amount}`;
    const response = await axios.get(url);

    if (response.data && response.data.result === "success") {
      res.json({
        base: from,
        target: to,
        conversionRate: response.data.conversion_rate,
        convertedAmount: response.data.conversion_result,
      });
    } else {
      res.status(400).json({
        message: "Error converting currency",
        details: response.data || "Unknown error",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error converting currency",
      details: error.message || "Unexpected error occurred",
    });
  }
});

//! Start the server
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}...`);
});
