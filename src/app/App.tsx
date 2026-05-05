import { useState } from "react";
import { TopBar } from "./components/TopBar";
import { DashboardPage } from "./pages/DashboardPage";
import { ViewDetailsPage } from "./pages/ViewDetailsPage";
import { LandingPage } from "./pages/LandingPage";
import { CommandSidebar } from "./components/bloomberg/CommandSidebar";
import { CommandPalette } from "./components/bloomberg/CommandPalette";
import { ThreeColumnLayout } from "./components/bloomberg/ThreeColumnLayout";
import { ToastProvider } from "./components/bloomberg/ToastNotifications";
import { ThemeProvider } from "./context/ThemeContext";
import { useAppRouter } from "./router";
import { useBlockPulse } from "./hooks/useBlockPulse";

function AppContent() {
  const router = useAppRouter("dashboard");
  const [entered, setEntered] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState<"standard" | "bloomberg">("standard");
  useBlockPulse();

  if (!entered)
    return <LandingPage onEnter={() => setEntered(true)} />;

  // Bloomberg Terminal Layout (Three-column)
  if (layoutMode === "bloomberg") {
    return (
      <div
        className="size-full min-h-screen bg-neutral-50 dark:bg-terminal-deep text-neutral-900 dark:text-neutral-100 overflow-auto transition-colors duration-200"
        style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        <style>{`
          .font-mono{font-family:'JetBrains Mono',ui-monospace,monospace}
          .font-sans{font-family:'DM Sans',system-ui,sans-serif}
          @keyframes pulseBorder { 0%,100% { border-color:#D4D4D4 } 50% { border-color:#6366F1 } }
          .pulse-border { animation: pulseBorder 6s ease-in-out infinite; }
        `}</style>

        {/* Bloomberg Command Sidebar */}
        <CommandSidebar
          currentRoute={router.route}
          onNavigate={(route) => {
            if (route === "dashboard") setLayoutMode("standard");
            router.setRoute(route as any);
          }}
          onSearchOpen={() => setCommandPaletteOpen(true)}
        />

        {/* Global Command Palette (Cmd+K) */}
        <CommandPalette
          open={commandPaletteOpen}
          onOpenChange={setCommandPaletteOpen}
          onNavigate={(assetId) => router.goDetails(assetId)}
        />

        {/* Three-Column Bloomberg Layout */}
        <div className="ml-[60px] h-screen">
          <ThreeColumnLayout onPropertySelect={(assetId) => router.goDetails(assetId)} />
        </div>

        {/* Layout Toggle (floating) */}
        <button
          onClick={() => setLayoutMode("standard")}
          className="fixed bottom-6 right-6 z-50 px-4 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-[2px] font-mono text-[10px] uppercase tracking-widest text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 shadow-lg transition-colors"
        >
          Exit Bloomberg Mode
        </button>
      </div>
    );
  }

  // Standard Layout
  return (
    <div
      className="size-full min-h-screen bg-[#FAFAFA] dark:bg-terminal-deep text-neutral-900 dark:text-neutral-100 overflow-auto transition-colors duration-200"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`
        .font-mono{font-family:'JetBrains Mono',ui-monospace,monospace}
        .font-sans{font-family:'DM Sans',system-ui,sans-serif}
        @keyframes pulseBorder { 0%,100% { border-color:#D4D4D4 } 50% { border-color:#6366F1 } }
        .pulse-border { animation: pulseBorder 6s ease-in-out infinite; }
      `}</style>

      {/* Bloomberg Command Sidebar */}
      <CommandSidebar
        currentRoute={router.route}
        onNavigate={(route) => router.setRoute(route as any)}
        onSearchOpen={() => setCommandPaletteOpen(true)}
      />

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onNavigate={(assetId) => router.goDetails(assetId)}
      />

      {/* Main content with left offset for sidebar */}
      <div className="ml-[60px]">
        <TopBar
          route={router.route}
          onRoute={router.setRoute}
          onLayoutToggle={() => setLayoutMode("bloomberg")}
        />
        {router.route === "dashboard" ? (
          <DashboardPage onOpen={router.goDetails} />
        ) : (
          <ViewDetailsPage
            assetId={router.assetId}
            onBack={router.goDashboard}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
      <ToastProvider />
    </ThemeProvider>
  );
}