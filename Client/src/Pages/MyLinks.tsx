import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { useGetUrls } from '@/hooks/url/useUrl';
import type { URLDocument } from '@/types/UrlTypes';
import UrlCard from '@/components/Card/UrlCard';
import UrlGridCard from '@/components/Card/UrlGridCard';

type ViewMode = 'card' | 'grid';

const MyLinks = () => {
  const [urls, setUrls] = useState<URLDocument[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const { data: fetchedUrls, isLoading: isFetchingUrls } = useGetUrls();
  const navigate = useNavigate();

  useEffect(() => {
    if (fetchedUrls && Array.isArray(fetchedUrls)) {
      setUrls(fetchedUrls);
    }
  }, [fetchedUrls]);

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'card' ? 'grid' : 'card');
  };

  const renderUrls = () => {
    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {urls.map((url) => (
            <UrlGridCard
              key={url._id}
              url={url}
              showClicks={true}
              qrCodeSize={30}
              onClick={() => navigate(`/analytics/${url._id}`)} 
            />
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {urls.map((url) => (
          <UrlCard
            key={url._id}
            url={url}
            showClicks={true}
            qrCodeSize={30}
            onClick={() => navigate(`/analytics/${url._id}`)} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-green-light flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl shadow-xl border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              My Links
            </CardTitle>
            
            {isLoggedIn && urls.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleViewMode}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'card' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Card
                </button>
                <button
                  onClick={toggleViewMode}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Grid
                </button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isFetchingUrls ? (
            <p className="text-muted-foreground text-center">Loading...</p>
          ) : isLoggedIn && urls.length > 0 ? (
            renderUrls()
          ) : (
            <p className="text-center text-lg text-muted-foreground">
              {isLoggedIn ? 'No URLs found' : 'Please log in to view your shortened links.'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyLinks;