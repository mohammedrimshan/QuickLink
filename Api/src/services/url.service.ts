import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { AppError } from '../utils/appError';
import { ERROR_MESSAGES } from '../constants/messages';
import { StatusCode } from '../constants/statusCode';

export const generateShortUrl = (): string => {
  return uuidv4().split('-')[0];
};

export const generateQRCode = async (url: string): Promise<string | null> => {
  try {
    return await QRCode.toDataURL(url);
   } catch (err) {
        throw new AppError(
          ERROR_MESSAGES.QR_CODE_GENERATION_ERROR,
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }
};


// Utility function to ensure URL has a protocol
export const ensureProtocol = (url: string): string => {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
};
