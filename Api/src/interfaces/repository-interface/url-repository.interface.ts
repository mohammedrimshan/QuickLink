import { URLDocument } from "../../types/url";
import { IBaseRepository } from "./base-repository.interface";

export interface IUrlRepository extends IBaseRepository<URLDocument> {
  findByShortUrl(shortUrl: string): Promise<URLDocument | null>;
  findByIdAndUserId(id: string, userId: string): Promise<URLDocument | null>;
  findByUserId(userId: string): Promise<URLDocument[]>;
  searchByUserId(userId: string, query: string): Promise<URLDocument[]>;
}
