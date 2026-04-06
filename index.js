const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Routes
const authRoutes = require("./Routes/authRouter");
const CategoryRouter = require("./Routes/CategoryRouter");
const ProductRoutes = require("./Routes/ProductRoutes");

// Config
dotenv.config();

// App
const app = express();

// ✅ CORS FIX (VERY IMPORTANT)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://watchecom-frontend2.onrender.com",
      "https://watchecom-frontend1.vercel.app" // ✅ REAL URL टाक
    ],
    credentials: true,
  })
);

// Middlewares
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/category", CategoryRouter);
app.use("/api/product", ProductRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// Server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
