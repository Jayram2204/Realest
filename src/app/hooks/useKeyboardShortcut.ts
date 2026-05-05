import { useEffect } from "react";

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: (e: KeyboardEvent) => void;
  preventDefault?: boolean;
}

/**
 * Hook to register keyboard shortcuts
 * @example
 * useKeyboardShortcut({ key: 'k', meta: true, callback: () => openSearch() })
 */
export function useKeyboardShortcut(config: ShortcutConfig) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const matchesKey = e.key.toLowerCase() === config.key.toLowerCase();
      const matchesCtrl = config.ctrl === undefined || e.ctrlKey === config.ctrl;
      const matchesMeta = config.meta === undefined || e.metaKey === config.meta;
      const matchesShift = config.shift === undefined || e.shiftKey === config.shift;
      const matchesAlt = config.alt === undefined || e.altKey === config.alt;

      if (matchesKey && matchesCtrl && matchesMeta && matchesShift && matchesAlt) {
        if (config.preventDefault !== false) {
          e.preventDefault();
        }
        config.callback(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [config]);
}

/**
 * Hook to register ESC key for closing modals/panels
 */
export function useEscapeKey(callback: () => void, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callback, enabled]);
}
