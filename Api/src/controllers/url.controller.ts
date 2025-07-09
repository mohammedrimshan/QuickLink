import { Request, Response } from "express";
import { isURL } from "validator";
import { URLModel } from "../models/url.model";
import { AppError } from "../utils/appError";
import { StatusCode } from "../constants/statusCode";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../constants/messages";
import {
  generateShortUrl,
  generateQRCode,
  ensureProtocol,
} from "../services/url.service";
import { URLAnalytics } from "../types/url";
import { UserModel } from "../models/user.model";

// Redirect controller
export const redirect = async (req: Request, res: Response) => {
  const { shortUrl } = req.params;
  console.log(`Redirect request for: ${shortUrl}, Host: ${req.headers.host}`);

  const urlDoc = await URLModel.findOne({ shortUrl });
  if (!urlDoc) {
    console.error(`URL not found: ${shortUrl}`);
    throw new AppError(ERROR_MESSAGES.URL_NOT_FOUND, StatusCode.NOT_FOUND);
  }

  let redirectUrl = ensureProtocol(urlDoc.longUrl);
  console.log(`Redirecting to: ${redirectUrl}`);
  if (!isURL(redirectUrl)) {
    console.error(`Invalid URL: ${redirectUrl}`);
    throw new AppError(ERROR_MESSAGES.INVALID_URL, StatusCode.BAD_REQUEST);
  }

  try {
    urlDoc.clicks.push({
      timestamp: new Date(),
      referrer: req.headers.referer || "Direct",
      userAgent: req.headers["user-agent"] || "",
      ip: req.ip,
      country: Array.isArray(req.headers["cf-ipcountry"])
        ? req.headers["cf-ipcountry"][0]
        : req.headers["cf-ipcountry"] || "Unknown",
    });
    await urlDoc.save();
  } catch (trackingError) {
    console.error("Click tracking error:", trackingError);
  }

  res.redirect(StatusCode.MOVED_TEMPORARILY, redirectUrl); // Use 302
};

// Create URL controller
export const createUrl = async (req: Request, res: Response) => {
  try {
    const { longUrl, customUrl } = req.body;
    console.log(longUrl, customUrl);
    const userId = (req.user as any)._id;
    const fullLongUrl = ensureProtocol(longUrl);
    if (!isURL(fullLongUrl)) {
      throw new AppError(ERROR_MESSAGES.INVALID_URL, StatusCode.BAD_REQUEST);
    }

    if (customUrl) {
      const existingUrl = await URLModel.findOne({ shortUrl: customUrl });
      if (existingUrl) {
        throw new AppError(
          ERROR_MESSAGES.SHORT_URL_EXISTS,
          StatusCode.CONFLICT
        );
      }
    }

    const baseUrl = process.env.DOMAIN_URL || "https://quicklink.rimshan.in";
    const shortUrl = customUrl || generateShortUrl();
    const fullShortUrl = `${baseUrl}/${shortUrl}`;

    const url = await URLModel.create({
      longUrl: fullLongUrl,
      shortUrl,
      customUrl,
      fullShortUrl,
      qrCode: await generateQRCode(fullShortUrl),
      userId,
    });

    res.status(StatusCode.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.URL_CREATED,
      data: url,
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    } else {
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
    }
  }
};

// Get URLs controller
export const getUrls = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const urls = await URLModel.find({ userId }).sort({ createdAt: -1 });

    res.status(StatusCode.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.URLS_FETCHED,
      data: urls,
    });
  } catch (error: any) {
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

// Get Analytics controller
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const { urlId } = req.params;
    const userId = (req.user as any)._id;

    const url = await URLModel.findOne({ _id: urlId, userId });
    if (!url) {
      throw new AppError(ERROR_MESSAGES.URL_NOT_FOUND, StatusCode.NOT_FOUND);
    }

    const analytics: URLAnalytics = {
      totalClicks: url.clicks.length,
      clicksByDate: {},
      browsers: {},
      countries: {},
      referrers: {},
    };

    url.clicks.forEach((click) => {
      const date = click.timestamp.toISOString().split("T")[0];
      analytics.clicksByDate[date] = (analytics.clicksByDate[date] || 0) + 1;

      const browser = click.userAgent || "Unknown";
      analytics.browsers[browser] = (analytics.browsers[browser] || 0) + 1;

      if (click.country) {
        analytics.countries[click.country] =
          (analytics.countries[click.country] || 0) + 1;
      }

      const referrer = click.referrer || "Direct";
      analytics.referrers[referrer] = (analytics.referrers[referrer] || 0) + 1;
    });

    res.status(StatusCode.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.ANALYTICS_FETCHED,
      data: analytics,
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    } else {
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
    }
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.user.id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    }

    res.status(StatusCode.OK).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        photoUrl: user.photoUrl || null,
        isVerified: user.isVerified,
      },
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
    } else {
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
    }
  }
};

