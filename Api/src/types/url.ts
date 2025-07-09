import {  Document, Types } from "mongoose";


export interface URLAnalytics {
  totalClicks: number;
  clicksByDate: { [date: string]: number };
  browsers: { [browser: string]: number };
  countries: { [country: string]: number };
  referrers: { [referrer: string]: number };
}

interface Click {
  timestamp: Date;
  referrer?: string;
  userAgent?: string;
  ip?: string;
  country?: string;
}

export interface IUrl{
   longUrl: string;
  shortUrl: string;
  customUrl?: string;
  fullShortUrl?: string;
  qrCode?: string;
  userId?: Types.ObjectId;
  clicks: Click[];
  createdAt?: Date;
}
export interface URLDocument extends Document, IUrl {}
