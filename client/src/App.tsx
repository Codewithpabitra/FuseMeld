import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, useUser, SignIn, SignUp } from "@clerk/clerk-react";
import { setAuthToken, syncUser } from "./lib/api.js";
import Home from "./pages/Home.js";
import Dashboard from "./pages/Dashboard.js";
import Story from "./pages/Story.js";
import Profile from "./pages/Profile.js";

// Wraps routes that require login
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) return <Navigate to="/sign-in" replace />;

  return <>{children}</>;
};

export default function App() {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();

  // Sync token to axios whenever auth state changes
  useEffect(() => {
    const syncToken = async () => {
      if (isSignedIn) {
        const token = await getToken();
        setAuthToken(token);

        // Sync user into MongoDB on login
        if (user) {
          try {
            await syncUser({
              email: user.primaryEmailAddress?.emailAddress ?? "",
              username: user.username ?? user.firstName ?? "user",
            });
          } catch {
            // User already exists - that's fine
          }
        }
      } else {
        setAuthToken(null);
      }
    };

    void syncToken();
  }, [isSignedIn, getToken, user]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route
          path="/sign-in"
          element={
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
              <SignIn routing="path" path="/sign-in" afterSignInUrl="/" />
            </div>
          }
        />
        <Route
          path="/sign-up"
          element={
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
              <SignUp routing="path" path="/sign-up" afterSignUpUrl="/" />
            </div>
          }
        />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/story"
          element={
            <ProtectedRoute>
              <Story />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
