require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const errorHandler = require("./middleware/errorHandler");
const rateLimit = require("express-rate-limit");

const app = express();

// Configure middlewares with open CORS
app.use(
  cors({
    origin: "*", // This allows all origins
    credentials: true,
  })
);

app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests, please try again later.",
});

app.use("/api/auth", authLimiter);
app.use("/api/auth", authRoutes);
app.use(errorHandler);

// MongoDB connection URL
const url = process.env.MONGODB_URL;

const options = {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 5000,
};

// Connect to MongoDB before starting the server
const connectDB = async () => {
  try {
    await mongoose.connect(url, options);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("MongoDB Error:", error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;


  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

// Connect to database
connectDB();

// Export the app for Vercel
module.exports = app;