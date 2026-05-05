import { LayoutGrid } from "lucide-react";
import { NetworkIndicator } from "./ui/NetworkIndicator";
import { ThemeToggleCompact } from "./bloomberg/ThemeToggle";
import { useIdentity } from "../hooks/useChain";
import { formatHash } from "../lib/cn";
import type { Route } from "../router";

interface Props {
  route: Route;
  onRoute: (r: Route) => void;
  onLayoutToggle?: () => void;
}

export function TopBar({ route, onRoute, onLayoutToggle }: Props) {
  const identity = useIdentity();
  const tabs: { id: Route; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "details", label: "View Details" },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-300 dark:border-neutral-700 bg-[#FAFAFA]/95 dark:bg-terminal-deep/95 backdrop-blur transition-colors">
      <div className="flex items-center gap-6 px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 border border-neutral-900 dark:border-neutral-100 flex items-center justify-center rounded-[2px]">
            <div className="w-2 h-2 bg-neutral-900 dark:bg-neutral-100" />
          </div>
          <div>
            <div className="font-sans font-semibold text-[14px] text-neutral-900 dark:text-neutral-100 tracking-tight">RealToken</div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Verified Terminal</div>
          </div>
        </div>

        <nav className="flex items-center gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => onRoute(t.id)}
              className={`border rounded-[2px] px-3 py-1.5 font-sans text-[12px] font-medium tracking-wide transition-colors ${
                route === t.id
                  ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100"
                  : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {/* Bloomberg Layout Toggle */}
          {onLayoutToggle && (
            <button
              onClick={onLayoutToggle}
              className="flex items-center gap-2 border border-neutral-300 dark:border-neutral-700 rounded-[2px] px-3 py-1.5 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Switch to Bloomberg layout"
            >
              <LayoutGrid size={14} />
              <span className="font-mono text-[10px] uppercase tracking-widest">Bloomberg</span>
            </button>
          )}

          {/* Theme Toggle */}
          <ThemeToggleCompact />

          <NetworkIndicator />

          {identity.data && (
            <div className="flex items-center gap-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-[2px] px-3 py-1.5">
              <div className="flex flex-col leading-none">
                <span className="font-sans text-[11px] text-neutral-900 dark:text-neutral-100">{identity.data.role}</span>
                <span className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
                  {identity.data.mspId} · {formatHash(identity.data.wallet, 6, 4)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
