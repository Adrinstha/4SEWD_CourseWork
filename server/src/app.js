import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// Enable CORS for Vercel deployment and local development
const allowedOrigin = process.env.CLIENT_ORIGIN || "*";

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigin === "*" || origin === allowedOrigin || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
const uploadsPath = path.resolve(process.cwd(), "./storage/uploads");
app.use("/uploads", express.static(uploadsPath));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), environment: process.env.NODE_ENV || "development" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

// Global Error Handler
app.use(errorHandler);

export default app;
