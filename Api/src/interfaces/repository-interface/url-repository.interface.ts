import { IUrl, URLDocument } from "../../types/url";

export interface IUrlRepository {
  findByShortUrl(shortUrl: string): Promise<URLDocument | null>;
  findByIdAndUserId(id: string, userId: string): Promise<URLDocument | null>;
  findByUserId(userId: string): Promise<URLDocument[]>;
  searchByUserId(userId: string, query: string): Promise<URLDocument[]>;
  create(urlData: Partial<IUrl>): Promise<URLDocument>;
  update(id: string, urlData: Partial<IUrl>): Promise<URLDocument | null>;
}