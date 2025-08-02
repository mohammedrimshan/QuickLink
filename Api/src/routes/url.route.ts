import { Router } from "express";
import asyncHandler from "express-async-handler";
import { validate } from "../middlewares/validator.middleware";
import { verifyAuth } from "../middlewares/auth.middleware";
import { createUrlSchema } from "../utils/validators/url.zod";
import { IUrlController } from "../interfaces/controller-interface/url-controller.interface";

export default function urlRoutes(urlController: IUrlController): Router {
  const router = Router();

  router.post("/", validate(createUrlSchema), verifyAuth, asyncHandler(urlController.createUrl.bind(urlController)));
  router.get("/analytics/:urlId", verifyAuth, asyncHandler(urlController.getAnalytics.bind(urlController)));
  router.get("/me", verifyAuth, asyncHandler(urlController.getMe.bind(urlController)));
  router.get("/", verifyAuth, asyncHandler(urlController.getUrls.bind(urlController)));
  router.get("/search", verifyAuth, asyncHandler(urlController.searchUrls.bind(urlController)));
  router.get("/s/:shortUrl", asyncHandler(urlController.redirect.bind(urlController)));

  return router;
}