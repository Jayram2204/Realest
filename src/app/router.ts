import { useState } from "react";

export type Route = "dashboard" | "details";

export interface RouterState {
  route: Route;
  assetId: string | null;
  goDashboard(): void;
  goDetails(assetId: string): void;
  setRoute(r: Route): void;
}

export function useAppRouter(initial: Route = "dashboard"): RouterState {
  const [route, setRoute] = useState<Route>(initial);
  const [assetId, setAssetId] = useState<string | null>(null);
  return {
    route,
    assetId,
    goDashboard: () => setRoute("dashboard"),
    goDetails: (id) => {
      setAssetId(id);
      setRoute("details");
    },
    setRoute,
  };
}
