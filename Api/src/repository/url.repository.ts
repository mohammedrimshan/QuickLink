import { URLModel } from "../models/url.model";
import { URLDocument } from "../types/url";
import { IUrlRepository } from "../interfaces/repository-interface/url-repository.interface";
import { BaseRepository } from "./base.respository";

export class UrlRepository
  extends BaseRepository<URLDocument>
  implements IUrlRepository
{
  constructor() {
    super(URLModel);
  }

  async findByShortUrl(shortUrl: string): Promise<URLDocument | null> {
    return this.model
      .findOne({ shortUrl: shortUrl.trim().toLowerCase() })
      .exec();
  }

  async findByIdAndUserId(id: string, userId: string): Promise<URLDocument | null> {
    return this.model.findOne({ _id: id, userId }).exec();
  }

  async findByUserId(userId: string): Promise<URLDocument[]> {
    return this.model.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async searchByUserId(userId: string, query: string): Promise<URLDocument[]> {
    return this.model
      .find({
        userId,
        $or: [
          { longUrl: { $regex: query, $options: "i" } },
          { shortUrl: { $regex: query, $options: "i" } },
        ],
      })
      .sort({ createdAt: -1 })
      .exec();
  }
}
