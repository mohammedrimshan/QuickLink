import { Card } from "@/components/ui/card";
import type { URLDocument } from "@/types/UrlTypes";

interface UrlGridCardProps {
  url: URLDocument;
  showClicks?: boolean;
  qrCodeSize?: number;
  onClick?: () => void;
}

const UrlGridCard = ({
  url,
  showClicks = false,
  qrCodeSize = 20,
  onClick,
}: UrlGridCardProps) => {
  const handleUrlClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url.fullShortUrl, "_blank"); 
  };

  const handleCardClick = (_e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card
      className="p-4 bg-card/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full"
      onClick={handleCardClick}
    >
      <div className="flex flex-col gap-3 h-full">
        <div className="flex-1">
          <p className="font-medium text-sm mb-2">
            Short URL:{" "}
            <a
              href={url.fullShortUrl}
              onClick={handleUrlClick}
              className="text-green-600 dark:text-green-400 hover:underline cursor-pointer break-all"
            >
              {url.fullShortUrl}
            </a>
          </p>
          <p className="text-xs text-muted-foreground break-all">
            Original: {url.longUrl}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          {showClicks && (
            <p className="text-xs text-muted-foreground">
              Clicks: {url.clicks?.length || 0}
            </p>
          )}
          {url.qrCode && (
            <a
              href={url.qrCode}
              download="qr-code.png"
              className="block ml-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={url.qrCode}
                alt="QR Code"
                className="cursor-pointer"
                style={{ width: `${qrCodeSize}px`, height: `${qrCodeSize}px` }}
                title="Click to download QR code"
              />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};

export default UrlGridCard;