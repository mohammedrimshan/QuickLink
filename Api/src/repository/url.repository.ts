import { IUrlRepository } from "../interfaces/repository-interface/url-repository.interface";
import { URLModel } from "../models/url.model";
import { URLDocument } from "../types/url";

export class UrlRepository implements IUrlRepository {
  async findByShortUrl(shortUrl: string): Promise<URLDocument | null> {
    return await URLModel.findOne({
      shortUrl: shortUrl.trim().toLowerCase(),
    }).exec();
  }

  async findByIdAndUserId(
    id: string,
    userId: string
  ): Promise<URLDocument | null> {
    return await URLModel.findOne({ _id: id, userId }).exec();
  }

  async findByUserId(userId: string): Promise<URLDocument[]> {
    return await URLModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async searchByUserId(userId: string, query: string): Promise<URLDocument[]> {
    return await URLModel.find({
      userId,
      $or: [
        { longUrl: { $regex: query, $options: "i" } },
        { shortUrl: { $regex: query, $options: "i" } },
      ],
    })
      .sort({ createdAt: -1 })
      .exec();
  }

  async create(urlData: Partial<URLDocument>): Promise<URLDocument> {
    return await URLModel.create(urlData);
  }

  async update(
    id: string,
    urlData: Partial<URLDocument>
  ): Promise<URLDocument | null> {
    return await URLModel.findByIdAndUpdate(id, urlData, { new: true }).exec();
  }
}
