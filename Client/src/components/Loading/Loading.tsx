import { useEffect, useState } from 'react';
import { Link as LinkIcon } from 'lucide-react';

interface LoadingPageProps {
  onLoadingComplete: () => void;
}

const LoadingPage = ({ onLoadingComplete }: LoadingPageProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onLoadingComplete(), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <div className="min-h-screen bg-gradient-green-light flex items-center justify-center">
      <div className="text-center">
        {/* Logo Animation */}
        <div className="mb-8">
          <div className="bg-gradient-green p-6 rounded-full inline-block animate-pulse">
            <LinkIcon className="h-12 w-12 text-white" />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl font-bold text-gradient-green mb-4">
          QuickLink
        </h1>

        {/* Loading Text */}
        <p className="text-muted-foreground mb-8">Preparing your URL shortener...</p>

        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-green h-full rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center space-x-1 mt-6">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-green-700 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-green-800 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;