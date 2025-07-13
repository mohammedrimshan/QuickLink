import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useGetUrls } from "@/hooks/url/useUrl";
import type { URLDocument } from "@/types/UrlTypes";
import UrlCard from "@/components/Card/UrlCard";
import UrlGridCard from "@/components/Card/UrlGridCard";
import Pagination from "@/components/Pagination/Pagination";

type ViewMode = "card" | "grid";

const MyLinks = () => {
  const [urls, setUrls] = useState<URLDocument[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [currentPage, setCurrentPage] = useState(1);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const { data: fetchedUrls, isLoading: isFetchingUrls } = useGetUrls();
  const navigate = useNavigate();

  const itemsPerPage = viewMode === "card" ? 5 : 6;

  useEffect(() => {
    if (fetchedUrls && Array.isArray(fetchedUrls)) {
      setUrls(fetchedUrls);
      setCurrentPage(1);
    }
  }, [fetchedUrls]);

  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode]);

  const { paginatedUrls, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedUrls = urls.slice(startIndex, endIndex);
    const totalPages = Math.ceil(urls.length / itemsPerPage);

    return { paginatedUrls, totalPages };
  }, [urls, currentPage, itemsPerPage]);

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "card" ? "grid" : "card"));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderUrls = () => {
    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedUrls.map((url) => (
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
        {paginatedUrls.map((url) => (
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

  const renderPaginationInfo = () => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, urls.length);

    return (
      <p className="text-sm text-muted-foreground text-center">
        Showing {startItem} to {endItem} of {urls.length} links
      </p>
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
                    viewMode === "card"
                      ? "bg-green-600 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Card
                </button>
                <button
                  onClick={toggleViewMode}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "grid"
                      ? "bg-green-600 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
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
            <div className="space-y-6">
              {renderUrls()}

              {urls.length > itemsPerPage && renderPaginationInfo()}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-6"
              />
            </div>
          ) : (
            <p className="text-center text-lg text-muted-foreground">
              {isLoggedIn
                ? "No URLs found"
                : "Please log in to view your shortened links."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyLinks;
