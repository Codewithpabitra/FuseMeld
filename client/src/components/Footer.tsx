import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <div className="w-full mx-auto py-5 px-5 sm:px-30 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t border-border bg-background/80 backdrop-blur-md ">
      <div className="flex flex-col items-start gap-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center items-center gap-1"
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
          className="text-sm sm:max-w-sm text-muted-foreground"
        >
          detect semantically similar GitHub issues - not just keyword matches.
        </motion.p>
        <p className="text-sm flex ">
          build with <Heart size={20} className="mx-1 text-red-500" /> by{" "}
          <a
            href="https://github.com/Codewithpabitra"
            target="_blank"
            className="ml-1 underline"
          >
            {" "}
            @Codewithpabitra
          </a>
        </p>
      </div>
      <div className="">
        <motion.ul
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col "
        >
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          <a
            href="https://github.com/Codewithpabitra/FuseMeld"
            target="_blank"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Github
          </a>
        </motion.ul>
      </div>
    </div>
  );
};

export default Footer;
