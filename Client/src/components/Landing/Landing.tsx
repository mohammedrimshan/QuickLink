// pages/LandingPage.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Shield, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import LoginPromptModal from "../Modal/LoginPromptModal";
import { useCreateUrl } from "@/hooks/url/useUrl";
import type { URLDocument } from "@/types/UrlTypes";
import QRCodePopup from "../Modal/QRCodePopup";
import UrlCard from "../Card/UrlCard";

const LandingPage = () => {
  const [url, setUrl] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [_shortenedUrl, setShortenedUrl] = useState("");
  const [newUrlData, setNewUrlData] = useState<URLDocument | null>(null);
  const [qrCodePopup, setQrCodePopup] = useState({ isOpen: false, url: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const createUrlMutation = useCreateUrl();

  const handleShortenUrl = async () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!url) {
      toast.error("Please enter a URL to shorten");
      return;
    }

    setIsLoading(true);

    createUrlMutation.mutate(
      { longUrl: url, customUrl: customUrl.trim() || undefined },
      {
        onSuccess: (data: URLDocument) => {
          setShortenedUrl(data.fullShortUrl);
          setNewUrlData(data);
          setUrl("");
          setCustomUrl("");
          setIsLoading(false);
          toast.success("Your URL has been shortened successfully");
          setQrCodePopup({ isOpen: true, url: data.fullShortUrl });
        },
        onError: (error: any) => {
          setIsLoading(false);

          const responseData = error?.response?.data;
          let message = "Failed to shorten URL";

          if (typeof responseData?.message === "string") {
            message = responseData.message;
          } else if (Array.isArray(responseData?.message)) {
            message = responseData.message[0]?.message || message;
          } else if (responseData?.errors?.length > 0) {
            message = responseData.errors[0]?.message || message;
          }

          toast.error(message);
        },
      }
    );
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-green-light">
      {/* Hero Section */}
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Shorten Your
            <span className="text-gradient-green block">Long URLs</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Transform lengthy URLs into clean, shareable links. Track clicks,
            boost engagement, and make your links memorable.
          </p>

          {/* URL Shortener Card */}
          <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="space-y-4">
                <Input
                  type="url"
                  placeholder="Enter your long URL here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-12 text-lg border-border focus:border-primary focus:ring-primary"
                />
                <div>
                  <Input
                    type="text"
                    placeholder="Custom URL (optional, e.g., portfolio)"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="h-12 text-lg border-border focus:border-primary focus:ring-primary"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Your URL will be: trimmrr.in/{customUrl || "generated-code"}
                  </p>
                </div>
                <Button
                  onClick={handleShortenUrl}
                  disabled={isLoading || createUrlMutation.isPending}
                  className="h-12 w-full bg-gradient-green hover:bg-gradient-green-hover text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading || createUrlMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Shortening...
                    </div>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Shorten
                    </>
                  )}
                </Button>

                {newUrlData && (
                  <div className="mt-6">
                    <UrlCard url={newUrlData} qrCodeSize={20} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-background/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose QuickLink?
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features to make your URL management effortless
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-0 bg-card/80 backdrop-blur-sm">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full w-fit mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Shorten URLs instantly with our optimized infrastructure
              </p>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-0 bg-card/80 backdrop-blur-sm">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full w-fit mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-muted-foreground">
                Your links are protected with enterprise-grade security
              </p>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-0 bg-card/80 backdrop-blur-sm">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full w-fit mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
              <p className="text-muted-foreground">
                Track clicks, locations, and performance metrics
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* QR Code Popup */}
      <QRCodePopup
        isOpen={qrCodePopup.isOpen}
        onClose={() => setQrCodePopup({ isOpen: false, url: "" })}
        url={qrCodePopup.url}
      />

      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
      />
    </div>
  );
};

export default LandingPage;
