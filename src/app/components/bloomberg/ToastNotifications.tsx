import { Toaster } from "sonner";
import { useTheme } from "../../context/ThemeContext";

export function ToastProvider() {
  const { theme } = useTheme();

  return (
    <Toaster
      theme={theme}
      position="bottom-right"
      toastOptions={{
        style: {
          fontFamily: "'DM Sans', system-ui, sans-serif",
        },
        classNames: {
          toast: "font-sans text-[13px]",
          title: "font-semibold",
          description: "font-mono text-[11px]",
          actionButton: "font-mono text-[10px] uppercase tracking-widest",
          cancelButton: "font-mono text-[10px] uppercase tracking-widest",
        },
      }}
      richColors
    />
  );
}

// Re-export toast for convenience
export { toast } from "sonner";
