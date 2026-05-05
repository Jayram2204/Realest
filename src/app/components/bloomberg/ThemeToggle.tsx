import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 border border-neutral-300 dark:border-neutral-700 rounded-full bg-neutral-100 dark:bg-neutral-800 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {/* Sliding indicator */}
      <motion.div
        animate={{
          x: theme === "dark" ? 28 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white dark:bg-neutral-900 shadow-sm flex items-center justify-center"
      >
        {theme === "light" ? (
          <Sun size={14} className="text-amber-500" />
        ) : (
          <Moon size={14} className="text-indigo-400" />
        )}
      </motion.div>

      {/* Background icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <Sun size={12} className="text-neutral-400 dark:text-neutral-600" />
        <Moon size={12} className="text-neutral-600 dark:text-neutral-400" />
      </div>
    </button>
  );
}

export function ThemeToggleCompact() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="p-2 border border-neutral-300 dark:border-neutral-700 rounded-[2px] bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {theme === "light" ? (
          <Sun size={16} className="text-amber-500" />
        ) : (
          <Moon size={16} className="text-indigo-400" />
        )}
      </motion.div>
    </motion.button>
  );
}
