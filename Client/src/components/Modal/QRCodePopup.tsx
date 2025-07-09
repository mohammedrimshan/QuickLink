import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QRCode from 'react-qr-code';
import confetti from 'canvas-confetti';

interface QRCodePopupProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

const QRCodePopup = ({ isOpen, onClose, url }: QRCodePopupProps) => {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card/80 backdrop-blur-sm border-0">
        <DialogHeader>
          <DialogTitle>QR Code for your shortened URL</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          <QRCode value={url} size={256} />
          <p className="mt-4 text-sm text-muted-foreground">
            Scan this QR code to access your shortened URL
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodePopup;