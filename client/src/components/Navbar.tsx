import { Link, useNavigate } from "react-router-dom";
import { UserButton, useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
              {/* Dashboard — always visible */}
              <Link
                to="/dashboard"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              >
                Dashboard
              </Link>

              {/* More menu — History + Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <span className="text-sm">Menu</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-44">
                  {/* Show Dashboard inside menu on mobile */}
                  <DropdownMenuItem
                    className="sm:hidden cursor-pointer"
                    onClick={() => navigate("/dashboard")}
                  >
                    <span className="text-sm">Dashboard</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="sm:hidden" />

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate("/history")}
                  >
                    <span className="mr-2">🕐</span>
                    <span className="text-sm">History</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate("/profile")}
                  >
                    <span className="mr-2">👤</span>
                    <span className="text-sm">Profile</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/sign-in")}
                className="cursor-pointer"
              >
                Sign in
              </Button>
              <Button size="sm" onClick={() => navigate("/sign-up")} className="cursor-pointer">
                Get started
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}