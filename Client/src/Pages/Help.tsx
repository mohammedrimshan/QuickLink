import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, ExternalLink, QrCode, BarChart3, Shield, Mail, MessageCircle } from "lucide-react";

const Help = () => {
  return (
    <div className="min-h-screen bg-gradient-green-light flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-xl border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">
            Help & Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Link className="w-5 h-5" />
              Getting Started
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Welcome to QuickLink! Our URL shortener makes it easy to create short, memorable links.</p>
              <div className="space-y-2">
                <p><strong>Step 1:</strong> Sign up for a free account or log in if you already have one.</p>
                <p><strong>Step 2:</strong> Enter your long URL in the shortening tool.</p>
                <p><strong>Step 3:</strong> Optionally customize your short URL or let us generate one for you.</p>
                <p><strong>Step 4:</strong> Share your shortened link anywhere!</p>
              </div>
            </div>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <QrCode className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">QR Code Generation</h3>
                  <p className="text-sm text-muted-foreground">Every shortened URL comes with a QR code for easy sharing on mobile devices.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">Click Analytics</h3>
                  <p className="text-sm text-muted-foreground">Track how many times your links are clicked and analyze engagement.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Link className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">Custom URLs</h3>
                  <p className="text-sm text-muted-foreground">Create branded, memorable short URLs that reflect your content.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground">Secure & Reliable</h3>
                  <p className="text-sm text-muted-foreground">Your links are protected and monitored for security threats.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Custom URL Guidelines</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>When creating custom URLs, please follow these guidelines:</p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p><strong>✅ Allowed:</strong> Letters (a-z, A-Z), numbers (0-9), hyphens (-), underscores (_)</p>
                <p><strong>✅ Length:</strong> 3-50 characters</p>
                <p><strong>✅ Format:</strong> Must start and end with a letter or number</p>
                <p><strong>❌ Not Allowed:</strong> Consecutive special characters, reserved keywords, inappropriate content</p>
              </div>
              <p><strong>Examples:</strong> myBlog2024, personal-site, company_link</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="font-medium text-foreground">How long do shortened links last?</h3>
                <p className="text-sm text-muted-foreground mt-1">Your shortened links are permanent and will work indefinitely as long as your account remains active.</p>
              </div>
              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="font-medium text-foreground">Can I edit a shortened URL after creation?</h3>
                <p className="text-sm text-muted-foreground mt-1">Currently, you cannot edit the destination URL after creation. You'll need to create a new shortened link.</p>
              </div>
              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="font-medium text-foreground">Is there a limit to how many URLs I can shorten?</h3>
                <p className="text-sm text-muted-foreground mt-1">Free accounts have generous limits. Contact support if you need higher limits for business use.</p>
              </div>
              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="font-medium text-foreground">How do I download QR codes?</h3>
                <p className="text-sm text-muted-foreground mt-1">Simply click on the QR code image in your links dashboard to download it as a PNG file.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Need More Help?</h2>
            <div className="bg-muted/50 p-6 rounded-lg">
              <p className="text-muted-foreground mb-4">Can't find what you're looking for? Our support team is here to help!</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="mailto:support@quicklink.rimshan.in"
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email Support
                </a>
                <a 
                  href="#"
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Live Chat
                </a>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;