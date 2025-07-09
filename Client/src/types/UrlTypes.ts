export interface URLDocument {
  _id: string;
  longUrl: string;
  shortUrl: string;
  customUrl?: string;
  fullShortUrl: string;
  qrCode: string;
  userId: string;
  clicks: {
    timestamp: string;
    referrer: string;
    userAgent: string;
    ip: string;
    country: string;
  }[];
  createdAt: string;
}

export interface URLAnalytics {
  totalClicks: number;
  clicksByDate: Record<string, number>;
  browsers: Record<string, number>;
  countries: Record<string, number>;
  referrers: Record<string, number>;
}

export interface CreateUrlRequest {
  longUrl: string;
  customUrl?: string;
}

