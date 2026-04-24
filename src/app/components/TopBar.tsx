import { NetworkIndicator } from "./ui/NetworkIndicator";
import { useIdentity } from "../hooks/useChain";
import { formatHash } from "../lib/cn";
import type { Route } from "../router";

interface Props {
  route: Route;
  onRoute: (r: Route) => void;
}

export function TopBar({ route, onRoute }: Props) {
  const identity = useIdentity();
  const tabs: { id: Route; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "details", label: "View Details" },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-300 bg-[#FAFAFA]/95 backdrop-blur">
      <div className="flex items-center gap-6 px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 border border-neutral-900 flex items-center justify-center rounded-[2px]">
            <div className="w-2 h-2 bg-neutral-900" />
          </div>
          <div>
            <div className="font-sans font-semibold text-[14px] text-neutral-900 tracking-tight">RealToken</div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Verified Terminal</div>
          </div>
        </div>

        <nav className="flex items-center gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => onRoute(t.id)}
              className={`border rounded-[2px] px-3 py-1.5 font-sans text-[12px] font-medium tracking-wide transition-colors ${
                route === t.id
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <NetworkIndicator />
          {identity.data && (
            <div className="flex items-center gap-2 border border-neutral-300 bg-white rounded-[2px] px-3 py-1.5">
              <div className="flex flex-col leading-none">
                <span className="font-sans text-[11px] text-neutral-900">{identity.data.role}</span>
                <span className="font-mono text-[10px] text-neutral-500">
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
