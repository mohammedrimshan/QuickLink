import { Schema, model, Document, Types } from "mongoose";
import { URLDocument } from "../types/url";

const urlSchema = new Schema<URLDocument>(
  {
    longUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    customUrl: { type: String, unique: true, sparse: true },
    fullShortUrl: { type: String },
    qrCode: String,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    clicks: [
      {
        timestamp: { type: Date, default: Date.now },
        referrer: String,
        userAgent: String,
        ip: String,
        country: String,
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const URLModel = model<URLDocument>("URL", urlSchema);