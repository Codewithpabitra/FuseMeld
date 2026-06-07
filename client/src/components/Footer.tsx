import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Left — branding */}
        <div className="flex flex-col gap-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">F</span>
            </div>
            <span className="font-semibold text-foreground tracking-tight">
              FuseMeld
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs text-muted-foreground max-w-xs"
          >
            Detect semantically similar GitHub issues — not just keyword matches.
          </motion.p>

          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Built with <Heart size={12} className="text-red-500" /> by{" "}
            <a
              href="https://github.com/Codewithpabitra"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              @Codewithpabitra
            </a>
          </p>
        </div>

        {/* Right — links */}
        <motion.ul
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-row items-center gap-5 sm:flex-col sm:items-end sm:gap-2"
        >
          <li>
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
          </li>
          <li>
            <a
              href="https://github.com/Codewithpabitra/FuseMeld"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </li>
        </motion.ul>

      </div>
    </footer>
  );
};

export default Footer;