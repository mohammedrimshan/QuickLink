import { useState } from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/Theme/ThemeProvider";
import LoadingPage from "./components/Loading/Loading";
import LandingPage from "./components/Landing/Landing";
import Navbar from "./components/NavBar/NavBar";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Registeration";
import ProtectedRoute from "./Protect/ProtectedRoute";
import AuthProtectedRoute from "./Protect/AuthProtectedRoute";
import Help from "./Pages/Help";
import Profile from "./Pages/Profile";
import MyLinks from "./Pages/MyLinks";
import Favorites from "./Pages/Favorites";
import Settings from "./Pages/Settings";

const queryClient = new QueryClient();

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingPage onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <TooltipProvider>
      <Toaster richColors />
      <BrowserRouter>
        <div className="min-h-screen">
          <Routes>
            {/* Public route: Accessible to all */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <LandingPage />
                </>
              }
            />
            {/* Protected routes: Only accessible to non-logged-in users */}
            <Route element={<ProtectedRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            {/* Auth-protected routes: Only accessible to logged-in users */}
            <Route element={<AuthProtectedRoute />}>
              <Route
                path="/profile"
                element={
                  <>
                    <Navbar />
                    <Profile />
                  </>
                }
              />
              <Route
                path="/my-links"
                element={
                  <>
                    <Navbar />
                    <MyLinks />
                  </>
                }
              />
              <Route
                path="/analytics/:urlId"
                element={
                  <>
                    <Navbar />
                    <Favorites />
                  </>
                }
              />
              <Route
                path="/settings"
                element={
                  <>
                    <Navbar />
                    <Settings />
                  </>
                }
              />
              <Route
                path="/help"
                element={
                  <>
                    <Navbar />
                    <Help />
                  </>
                }
              />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="quicklink-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;