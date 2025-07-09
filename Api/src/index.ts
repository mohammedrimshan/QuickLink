import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.route";
import privateRoutes from "./routes/url.route";

dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ALLOWED_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`⬇️ Incoming Request`);
  console.log(`${req.method} ${req.url}`);
  console.log("Headers:", req.headers["content-type"]);
  console.log("Body:", req.body);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pvt", privateRoutes);

// Health check
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running ✅" });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
