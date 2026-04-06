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

// ================= CORS FIX (FINAL) =================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://watchecom-frontend1.onrender.com", // ✅ IMPORTANT
  "https://watchecom-frontend2.onrender.com",
  "https://watchecom-frontend1.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ PREFLIGHT FIX (VERY IMPORTANT)
app.options("*", cors());

// Middlewares
app.use(express.json());

// ================= DB =================
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/category", CategoryRouter);
app.use("/api/product", ProductRoutes);

// ================= TEST =================
app.get("/", (req, res) => {
  res.send("API Running...");
});

// ================= HEALTH =================
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// ================= SERVER =================
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
