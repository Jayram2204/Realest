import { useState } from "react";
import { TopBar } from "./components/TopBar";
import { DashboardPage } from "./pages/DashboardPage";
import { ViewDetailsPage } from "./pages/ViewDetailsPage";
import { LandingPage } from "./pages/LandingPage";
import { useAppRouter } from "./router";
import { useBlockPulse } from "./hooks/useBlockPulse";

export default function App() {
  const router = useAppRouter("dashboard");
  const [entered, setEntered] = useState(false);
  useBlockPulse();

  if (!entered)
    return <LandingPage onEnter={() => setEntered(true)} />;

  return (
    <div
      className="size-full min-h-screen bg-[#FAFAFA] text-neutral-900 overflow-auto"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`
        .font-mono{font-family:'JetBrains Mono',ui-monospace,monospace}
        .font-sans{font-family:'DM Sans',system-ui,sans-serif}
        @keyframes pulseBorder { 0%,100% { border-color:#D4D4D4 } 50% { border-color:#6366F1 } }
        .pulse-border { animation: pulseBorder 6s ease-in-out infinite; }
      `}</style>
      <TopBar route={router.route} onRoute={router.setRoute} />
      {router.route === "dashboard" ? (
        <DashboardPage onOpen={router.goDetails} />
      ) : (
        <ViewDetailsPage
          assetId={router.assetId}
          onBack={router.goDashboard}
        />
      )}
    </div>
  );
}