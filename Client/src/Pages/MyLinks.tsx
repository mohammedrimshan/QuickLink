import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { useGetUrls } from '@/hooks/url/useUrl';
import type { URLDocument } from '@/types/UrlTypes';
import UrlCard from '@/components/Card/UrlCard';

const MyLinks = () => {
  const [urls, setUrls] = useState<URLDocument[]>([]);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const { data: fetchedUrls, isLoading: isFetchingUrls } = useGetUrls();
  const navigate = useNavigate();

  useEffect(() => {
    if (fetchedUrls && Array.isArray(fetchedUrls)) {
      setUrls(fetchedUrls);
    }
  }, [fetchedUrls]);

  return (
    <div className="min-h-screen bg-gradient-green-light flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-xl border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">
            My Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isFetchingUrls ? (
            <p className="text-muted-foreground text-center">Loading...</p>
          ) : isLoggedIn && urls.length > 0 ? (
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