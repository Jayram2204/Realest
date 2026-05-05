import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  LayoutDashboard,
  Building2,
  Lock,
  User,
  Settings,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useBlockPulse } from "../../hooks/useBlockPulse";

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  onClick: () => void;
}

interface CommandSidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onSearchOpen: () => void;
}

export function CommandSidebar({
  currentRoute,
  onNavigate,
  onSearchOpen,
}: CommandSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [networkOnline, setNetworkOnline] = useState(true);

  // Simulate network status with block pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkOnline((prev) => (Math.random() > 0.1 ? true : prev));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle hover with delay
  useEffect(() => {
    if (isPinned) {
      setIsExpanded(true);
      return;
    }

    if (isHovering) {
      const timeout = setTimeout(() => setIsExpanded(true), 300);
      return () => clearTimeout(timeout);
    } else {
      setIsExpanded(false);
    }
  }, [isHovering, isPinned]);

  // Keyboard shortcut Cmd+B to toggle pin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setIsPinned((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navItems: NavItem[] = [
    {
      id: "search",
      icon: <Search size={18} />,
      label: "Global Search",
      shortcut: "⌘K",
      onClick: onSearchOpen,
    },
    {
      id: "dashboard",
      icon: <LayoutDashboard size={18} />,
      label: "Portfolio Overview",
      onClick: () => onNavigate("dashboard"),
    },
    {
      id: "market",
      icon: <Building2 size={18} />,
      label: "Market Explorer",
      onClick: () => onNavigate("dashboard"),
    },
    {
      id: "escrow",
      icon: <Lock size={18} />,
      label: "Escrow Center",
      onClick: () => {},
    },
    {
      id: "identity",
      icon: <User size={18} />,
      label: "Identity & Trust",
      onClick: () => {},
    },
    {
      id: "settings",
      icon: <Settings size={18} />,
      label: "Settings",
      onClick: () => {},
    },
  ];

  return (
    <motion.aside
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => setIsPinned(!isPinned)}
      initial={false}
      animate={{ width: isExpanded ? 240 : 60 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="fixed left-0 top-0 h-screen bg-white border-r border-neutral-300 z-30 flex flex-col"
    >
      {/* Logo */}
      <div className="h-[61px] border-b border-neutral-300 flex items-center px-3 shrink-0">
        <div className="w-9 h-9 border border-neutral-900 flex items-center justify-center rounded-[2px] shrink-0">
          <div className="w-2.5 h-2.5 bg-neutral-900" />
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="ml-2.5"
            >
              <div className="font-sans font-semibold text-[13px] text-neutral-900 tracking-tight whitespace-nowrap">
                RealToken
              </div>
              <div className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 whitespace-nowrap">
                Terminal v2
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 overflow-hidden">
        <div className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isExpanded={isExpanded}
              isActive={currentRoute === item.id}
            />
          ))}
        </div>
      </nav>

      {/* Network Status (bottom-pinned) */}
      <div className="border-t border-neutral-300 p-3 shrink-0">
        <div
          className={`flex items-center gap-2.5 ${!isExpanded && "justify-center"}`}
        >
          {networkOnline ? (
            <Wifi size={16} className="text-emerald-600 shrink-0" />
          ) : (
            <WifiOff size={16} className="text-red-600 shrink-0" />
          )}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-900 whitespace-nowrap">
                  {networkOnline ? "Network Online" : "Reconnecting..."}
                </div>
                <div className="font-mono text-[9px] text-neutral-500 whitespace-nowrap">
                  Fabric v2.5.10
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}

function NavButton({
  item,
  isExpanded,
  isActive,
}: {
  item: NavItem;
  isExpanded: boolean;
  isActive: boolean;
}) {
  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        item.onClick();
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[2px] transition-colors ${
        isActive
          ? "bg-neutral-900 text-white"
          : "text-neutral-700 hover:bg-neutral-100"
      } ${!isExpanded && "justify-center"}`}
    >
      <span className="shrink-0">{item.icon}</span>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex items-center justify-between min-w-0"
          >
            <span className="font-sans text-[12px] font-medium whitespace-nowrap">
              {item.label}
            </span>
            {item.shortcut && (
              <span className="font-mono text-[9px] text-neutral-500 ml-2">
                {item.shortcut}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
