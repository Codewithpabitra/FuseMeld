import { Link, useNavigate } from "react-router-dom";
import { UserButton, useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">F</span>
          </div>
          <span className="font-semibold text-foreground tracking-tight">
            FuseMeld
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/sign-in")}
              >
                Sign in
              </Button>
              <Button size="sm" onClick={() => navigate("/sign-up")}>
                Get started
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}