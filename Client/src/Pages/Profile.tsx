import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMe } from "@/hooks/me/useUser";
import { Mail, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const { data: user, isLoading, isError } = useGetMe();
  console.log(user)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-green-light flex items-center justify-center p-4">
        <p className="text-lg text-foreground">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-green-light flex items-center justify-center p-4">
        <p className="text-lg text-red-500">Error loading profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-green-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-card/80 dark:bg-green-900/80 backdrop-blur-sm rounded-2xl overflow-hidden transform transition-all hover:scale-105">
        <CardHeader className="bg-gradient-to-r from-green-400 to-green-600 dark:from-green-800 dark:to-green-600 text-white p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20 border-4 border-white dark:border-green-700 shadow-md">
              <AvatarImage src={user?.photoUrl || "https://via.placeholder.com/150"} alt="Profile" />
              <AvatarFallback className="bg-green-700 dark:bg-green-800 text-white text-xl">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold">{user?.name || "N/A"}</CardTitle>
              <p className="text-sm opacity-80">Your Profile</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-700 transition-colors">
            <Mail className="h-5 w-5 text-green-600 dark:text-green-300" />
            <div>
              <p className="text-sm font-medium text-foreground dark:text-green-200">Email</p>
              <p className="text-base text-foreground dark:text-green-100">{user?.email || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-700 transition-colors">
            <Phone className="h-5 w-5 text-green-600 dark:text-green-300" />
            <div>
              <p className="text-sm font-medium text-foreground dark:text-green-200">Phone</p>
              <p className="text-base text-foreground dark:text-green-100">{user?.phoneNumber || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;