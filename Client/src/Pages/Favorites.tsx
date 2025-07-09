import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Globe,
  Monitor,
  ExternalLink,
  MousePointer,
  RefreshCw,
} from "lucide-react";
import { useGetAnalytics } from "@/hooks/url/useUrl";

const Favorites = () => {
  const { urlId } = useParams<{ urlId: string }>();
  const {
    data: analyticsData,
    isLoading,
    refetch,
  } = useGetAnalytics(urlId ?? "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-green-light flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="h-5 w-5 animate-spin text-gradient-green" />
              <p className="text-lg text-muted-foreground">
                Loading Analytics...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analyticsData || !urlId) {
    return (
      <div className="min-h-screen bg-gradient-green-light flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <p className="text-center text-lg text-muted-foreground">
              No analytics data available.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Transform data for charts
  const clicksTimeData = Object.entries(analyticsData.clicksByDate).map(
    ([date, clicks]) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      clicks,
    })
  );

  const browserData = Object.entries(analyticsData.browsers).map(
    ([browser, count]) => ({
      browser,
      count,
      percentage: Math.round((count / analyticsData.totalClicks) * 100),
    })
  );

  const countryData = Object.entries(analyticsData.countries).map(
    ([country, count]) => ({
      country,
      count,
      percentage: Math.round((count / analyticsData.totalClicks) * 100),
    })
  );

  const referrerData = Object.entries(analyticsData.referrers).map(
    ([referrer, count]) => ({
      referrer: referrer.includes("http")
        ? new URL(referrer).hostname
        : referrer,
      count,
      percentage: Math.round((count / analyticsData.totalClicks) * 100),
    })
  );

  const colors = [
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
  ];

  return (
    <div className="min-h-screen bg-gradient-green-light p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Link Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your link performance and engagement
            </p>
          </div>
          <Button
            onClick={() => refetch()}
            className="bg-gradient-green hover:bg-gradient-green-hover text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                  <p className="text-2xl font-bold text-foreground">
                    {analyticsData.totalClicks}
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <MousePointer className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Unique Countries
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {Object.keys(analyticsData.countries).length}
                  </p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Browsers</p>
                  <p className="text-2xl font-bold text-foreground">
                    {Object.keys(analyticsData.browsers).length}
                  </p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                  <Monitor className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Referrers</p>
                  <p className="text-2xl font-bold text-foreground">
                    {Object.keys(analyticsData.referrers).length}
                  </p>
                </div>
                <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                  <ExternalLink className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clicks Over Time */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-gradient-green" />
                <span>Clicks Over Time</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={clicksTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#10B981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Browser Distribution */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5 text-gradient-green" />
                <span>Browser Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={browserData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ browser, percentage }) =>
                      `${browser}: ${percentage}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {browserData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Countries */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-gradient-green" />
                <span>Traffic by Country</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={countryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="country" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Referrers */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <

CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ExternalLink className="h-5 w-5 text-gradient-green" />
                <span>Top Referrers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {referrerData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: colors[index % colors.length],
                        }}
                      ></div>
                      <span className="font-medium text-foreground">
                        {item.referrer}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {item.count}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.percentage}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Favorites;