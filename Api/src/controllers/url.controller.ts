import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCode";
import { AppError } from "../utils/appError";
import { CustomRequest } from "../middlewares/auth.middleware";
import { IUrlController } from "../interfaces/controller-interface/url-controller.interface";
import { IUrlService } from "../interfaces/services-interface/url-service.interface";

export class UrlController implements IUrlController {
  constructor(
    private urlService: IUrlService,
    private authService: AuthService
  ) {}

  async redirect(req: Request, res: Response) {
    try {
      const { shortUrl } = req.params;
      const ip =
        (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ||
        req.socket.remoteAddress ||
        "";
      const redirectUrl = await this.urlService.redirect(
        shortUrl,
        req.headers,
        ip
      );
      res.redirect(StatusCode.MOVED_TEMPORARILY, redirectUrl);
    } catch (error: any) {
      console.error("Redirect error:", error);
      res.status(error.statusCode || StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  }

  async createUrl(req: Request, res: Response) {
    try {
      const { longUrl, customUrl } = req.body;
      const user = (req as CustomRequest).user;
      const url = await this.urlService.createUrl(longUrl, user.id, customUrl);
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
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: ERROR_MESSAGES.SERVER_ERROR,
        });
      }
    }
  }

  async getUrls(req: Request, res: Response) {
    try {
      const user = (req as CustomRequest).user;
      const urls = await this.urlService.getUrls(user.id);
      res.status(StatusCode.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.URLS_FETCHED,
        data: urls,
      });
    } catch (error: any) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  }

  async getAnalytics(req: Request, res: Response) {
    try {
      const { urlId } = req.params;
      const user = (req as CustomRequest).user;
      const analytics = await this.urlService.getAnalytics(urlId, user.id);
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
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: ERROR_MESSAGES.SERVER_ERROR,
        });
      }
    }
  }

  async getMe(req: Request, res: Response) {
    try {
      const user = await this.authService.getMe(req.user.id);
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
        res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: ERROR_MESSAGES.SERVER_ERROR,
        });
      }
    }
  }

  async searchUrls(req: Request, res: Response) {
    try {
      const user = (req as CustomRequest).user;
      const { query } = req.query;
      const urls = await this.urlService.searchUrls(user.id, query as string);
      res.status(StatusCode.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.SEARCH_SUCCESS,
        data: urls,
      });
    } catch (error: any) {
      res.status(error.statusCode || StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  }
}
