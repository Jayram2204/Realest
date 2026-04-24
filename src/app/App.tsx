import { TopBar } from "./components/TopBar";
import { DashboardPage } from "./pages/DashboardPage";
import { ViewDetailsPage } from "./pages/ViewDetailsPage";
import { useAppRouter } from "./router";

export default function App() {
  const router = useAppRouter("dashboard");

  return (
    <div
      className="size-full min-h-screen bg-[#FAFAFA] text-neutral-900 overflow-auto"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`.font-mono{font-family:'JetBrains Mono',ui-monospace,monospace}.font-sans{font-family:'DM Sans',system-ui,sans-serif}`}</style>
      <TopBar route={router.route} onRoute={router.setRoute} />
      {router.route === "dashboard" ? (
        <DashboardPage onOpen={router.goDetails} />
      ) : (
        <ViewDetailsPage assetId={router.assetId} onBack={router.goDashboard} />
      )}
    </div>
  );
}
