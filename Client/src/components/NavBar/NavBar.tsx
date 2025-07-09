import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LogIn,
  LogOut,
  Link as LinkIcon,
  Menu,
  X,
  Home,
  User,
  Settings,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import { ThemeToggle } from "@/components/Theme/ThemeToggle";
import { useSelector, useDispatch } from "react-redux";
import { store, type RootState } from "@/store/store";
import { clearUser } from "@/store/userSlice";
import { useLogout } from "@/hooks/auth/useAuth";
import { toast } from "sonner";
import LogoutModal from "../Modal/LogoutModal";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state: RootState) => state.user);
  console.log('Navbar user state:', { user, isLoggedIn });

  const userName = user?.name ?? "";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const logoutMutation = useLogout();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      const response = await logoutMutation.mutateAsync();
      dispatch(clearUser());
      console.log("Redux cleared:", store.getState().user);
      setLogoutModalOpen(false);
      setSidebarOpen(false);
      toast.success(response.message || "Logged out successfully");
      navigate("/");
    } catch (error: any) {
      setLogoutModalOpen(false);
      setSidebarOpen(false);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Logout failed. Please try again.");
      }
    }
  };

  const handleLogoutCancel = () => {
    setLogoutModalOpen(false);
  };

  const navigationItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: BookOpen, label: "My Links", path: "/my-links" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: HelpCircle, label: "Help & Support", path: "/help" },
  ];

  return (
    <>
      <nav
        className={`bg-background border-b border-border shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-background/80 transition-all duration-300 ${
          sidebarOpen ? "blur-sm" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Brand and Menu */}
            <div className="flex items-center space-x-4">
              {isLoggedIn && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-gradient-green/10 transition-colors"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              )}
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="bg-gradient-green p-2 rounded-lg group-hover:scale-105 transition-transform">
                  <LinkIcon className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gradient-green">
                  QuickLink
                </span>
              </Link>
            </div>

            {/* Right side - Theme toggle, User name, and Auth buttons */}
            <div className="flex items-center space-x-4">
              {isLoggedIn && userName && (
                <span className="text-foreground font-medium hidden sm:block">
                  Welcome, {userName}
                </span>
              )}
              <ThemeToggle />
              {isLoggedIn ? (
                <Button
                  onClick={handleLogoutClick}
                  variant="outline"
                  className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-950 dark:hover:border-red-800 dark:hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Button
                  onClick={handleLoginClick}
                  className="bg-gradient-green hover:bg-gradient-green-hover text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-background/95 backdrop-blur-md border-r border-border shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-green p-2 rounded-lg">
                <LinkIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gradient-green">
                  QuickLink
                </h2>
                <p className="text-sm text-muted-foreground">Navigation Menu</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeSidebar}
              className="p-2 hover:bg-gradient-green/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          {isLoggedIn && userName && (
            <div className="p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-green rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{userName}</p>
                  <p className="text-sm text-muted-foreground">Active User</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-2 px-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-foreground hover:bg-gradient-green/10 hover:text-gradient-green transition-all duration-200 group"
                >
                  <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-border">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
              <Button
                onClick={handleLogoutClick}
                variant="outline"
                className="w-full hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-950 dark:hover:border-red-800 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        userName={userName ?? ""}
      />
    </>
  );
};

export default Navbar;
