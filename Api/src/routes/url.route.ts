import { Router } from "express";
import asyncHandler from "express-async-handler";
import { validate } from "../middlewares/validator.middleware";
import {
  createUrl,
  getUrls,
  redirect,
  getAnalytics,
  getMe,
} from "../controllers/url.controller";
import { createUrlSchema } from "../utils/validators/url.zod";
import { verifyAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/",
  validate(createUrlSchema),
  verifyAuth,
  asyncHandler(createUrl)
);

router.get("/analytics/:urlId", verifyAuth, asyncHandler(getAnalytics));

router.get("/me", verifyAuth, asyncHandler(getMe));

router.get("/", verifyAuth, asyncHandler(getUrls));

router.get("/:shortUrl", asyncHandler(redirect));
export default router;
