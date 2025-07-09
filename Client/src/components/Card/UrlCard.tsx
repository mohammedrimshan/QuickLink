import { Card } from "@/components/ui/card";
import type { URLDocument } from "@/types/UrlTypes";

interface UrlCardProps {
  url: URLDocument;
  showClicks?: boolean;
  qrCodeSize?: number;
  onClick?: () => void; 
}

const UrlCard = ({
  url,
  showClicks = false,
  qrCodeSize = 20,
  onClick,
}: UrlCardProps) => {
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
      className="p-4 bg-card/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="font-medium">
            Short URL:{" "}
            <a
              href={url.fullShortUrl}
              onClick={handleUrlClick}
              className="text-green-600 dark:text-green-400 hover:underline cursor-pointer"
            >
              {url.fullShortUrl}
            </a>
          </p>
          <p className="text-sm text-muted-foreground truncate max-w-md">
            Original: {url.longUrl}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {showClicks && (
            <p className="text-sm text-muted-foreground">
              Clicks: {url.clicks?.length || 0}
            </p>
          )}
          {url.qrCode && (
            <a
              href={url.qrCode}
              download="qr-code.png"
              className="block"
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

export default UrlCard;
