import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.route";
import urlRoutes from "./routes/url.route";
import { UserRepository } from "./repository/user.repository";
import { OtpRepository } from "./repository/otp.repository";
import { UrlRepository } from "./repository/url.repository";
import { OtpService } from "./services/otp.generate.service";
import { AuthService } from "./services/auth.service";
import { UrlService } from "./services/url.service";
import { AuthController } from "./controllers/auth.controller";
import { UrlController } from "./controllers/url.controller";
import asyncHandler from "express-async-handler";

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
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`⬇️ Incoming Request`);
  console.log(`${req.method} ${req.url}`);
  console.log("Headers:", req.headers["content-type"]);
  console.log("Body:", req.body);
  next();
});

// Instantiate repositories
const userRepository = new UserRepository();
const otpRepository = new OtpRepository();
const urlRepository = new UrlRepository();

// Instantiate services
const otpService = new OtpService(otpRepository);
const authService = new AuthService(userRepository, otpRepository, otpService);
const urlService = new UrlService(urlRepository);

// Instantiate controllers
const authController = new AuthController(authService);
const urlController = new UrlController(urlService, authService);

// Routes
app.use("/api/auth", authRoutes(authController));
app.use("/api/pvt", urlRoutes(urlController));
app.get("/s/:shortUrl", asyncHandler(urlController.redirect.bind(urlController)));

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