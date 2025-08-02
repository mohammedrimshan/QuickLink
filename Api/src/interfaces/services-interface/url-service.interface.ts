import { URLAnalytics, URLDocument } from "../../types/url";

export interface IUrlService {
  redirect(shortUrl: string, headers: any, ip: string): Promise<string>;
  createUrl(longUrl: string, userId: string, customUrl?: string): Promise<URLDocument>;
  getUrls(userId: string): Promise<URLDocument[]>;
  getAnalytics(urlId: string, userId: string): Promise<URLAnalytics>;
  searchUrls(userId: string, query: string): Promise<URLDocument[]>;
}
