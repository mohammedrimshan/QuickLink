import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-green-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-lg text-muted-foreground">
            User settings will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;