import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, Sparkles, Clock, Bell, User, Shield, Palette, Globe } from "lucide-react";

const Settings = () => {
  const upcomingFeatures = [
    {
      icon: <User className="w-5 h-5" />,
      title: "Profile Management",
      description: "Update your personal information and preferences"
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: "Notifications",
      description: "Configure email and push notification settings"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Security & Privacy",
      description: "Manage passwords, 2FA, and privacy controls"
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "Theme Customization",
      description: "Choose your preferred color scheme and layout"
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Language & Region",
      description: "Set your language and regional preferences"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-green-light flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center">
                <SettingsIcon className="w-8 h-8 text-green-600" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground mb-2">
            Settings
          </CardTitle>
          <div className="flex items-center justify-center gap-2 text-green-600">
            <Clock className="w-4 h-4" />
            <span className="font-medium">Coming Soon</span>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Main Message */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Exciting Features in Development
            </div>
            <p className="text-muted-foreground">
              We're working hard to bring you powerful customization options and enhanced control over your QuickLink experience.
            </p>
          </div>

          {/* Upcoming Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground text-center">What's Coming</h3>
            <div className="grid gap-3">
              {upcomingFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-600/10 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="text-center space-y-2 pt-4 border-t border-border">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Expected Launch</span>
            </div>
            <p className="text-lg font-semibold text-green-600">Q2 2025</p>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Want to be notified when settings are available?
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
              Get Notified
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;