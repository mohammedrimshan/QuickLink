import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import { URLDocument, URLAnalytics } from "../types/url";
import { AppError } from "../utils/appError";
import { ERROR_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCode";
import { isURL } from "validator";
import geoip from "geoip-lite";
import { IUrlRepository } from "../interfaces/repository-interface/url-repository.interface";
import { Types } from "mongoose";
import { IUrlService } from "../interfaces/services-interface/url-service.interface";

export const generateShortUrl = (): string => {
  return uuidv4().split("-")[0];
};

export const generateQRCode = async (url: string): Promise<string | null> => {
  try {
    return await QRCode.toDataURL(url);
  } catch (err) {
    throw new AppError(ERROR_MESSAGES.QR_CODE_GENERATION_ERROR, StatusCode.INTERNAL_SERVER_ERROR);
  }
};

export const ensureProtocol = (url: string): string => {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
};

export class UrlService implements IUrlService {
  constructor(private urlRepository: IUrlRepository) {}

  async redirect(shortUrl: string, headers: any, ip: string): Promise<string> {
    const urlDoc = await this.urlRepository.findByShortUrl(shortUrl);
    if (!urlDoc) {
      throw new AppError(ERROR_MESSAGES.URL_NOT_FOUND, StatusCode.NOT_FOUND);
    }

    const redirectUrl = ensureProtocol(urlDoc.longUrl);
    if (!isURL(redirectUrl)) {
      throw new AppError(ERROR_MESSAGES.INVALID_URL, StatusCode.BAD_REQUEST);
    }

    const geo = geoip.lookup(ip);
    const country = geo?.country || "Unknown";
    console.log(`Redirecting IP: ${ip}, Country: ${country}`);

    await this.urlRepository.update(urlDoc._id.toString(), {
      clicks: [
        ...urlDoc.clicks,
        {
          timestamp: new Date(),
          referrer: headers.referer || "Direct",
          userAgent: headers["user-agent"] || "",
          ip,
          country,
        },
      ],
    });

    return redirectUrl;
  }

  async createUrl(longUrl: string, userId: string, customUrl?: string): Promise<URLDocument> {
    const fullLongUrl = ensureProtocol(longUrl);
    if (!isURL(fullLongUrl)) {
      throw new AppError(ERROR_MESSAGES.INVALID_URL, StatusCode.BAD_REQUEST);
    }

    if (customUrl) {
      const existingUrl = await this.urlRepository.findByShortUrl(customUrl);
      if (existingUrl) {
        throw new AppError(ERROR_MESSAGES.SHORT_URL_EXISTS, StatusCode.CONFLICT);
      }
    }

    const baseUrl = process.env.DOMAIN_URL || "https://quicklink.rimshan.in";
    const shortUrl = customUrl || generateShortUrl();
    const fullShortUrl = `${baseUrl}/s/${shortUrl}`;
    const userObjectId = new Types.ObjectId(userId);
    const qrCode = (await generateQRCode(fullShortUrl)) ?? undefined;

    return await this.urlRepository.create({
      longUrl: fullLongUrl,
      shortUrl,
      customUrl,
      fullShortUrl,
      qrCode,
      userId: userObjectId,
    });
  }

  async getUrls(userId: string): Promise<URLDocument[]> {
    if (!userId) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
    }
    return await this.urlRepository.findByUserId(userId);
  }

  async getAnalytics(urlId: string, userId: string): Promise<URLAnalytics> {
    const url = await this.urlRepository.findByIdAndUserId(urlId, userId);
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
        analytics.countries[click.country] = (analytics.countries[click.country] || 0) + 1;
      }
      const referrer = click.referrer || "Direct";
      analytics.referrers[referrer] = (analytics.referrers[referrer] || 0) + 1;
    });

    return analytics;
  }

  async searchUrls(userId: string, query: string): Promise<URLDocument[]> {
    if (!query) {
      throw new AppError(ERROR_MESSAGES.URL_QUERY_REQUIRED, StatusCode.BAD_REQUEST);
    }
    return await this.urlRepository.searchByUserId(userId, query);
  }
}
