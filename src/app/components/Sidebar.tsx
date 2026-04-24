import { useState } from "react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useIdentity, useNavActions, useNetworkStatus } from "../hooks/useChain";
import type { OrgType } from "../types/chain";

const mono = { fontFamily: "'Space Mono', monospace" };
const syne = { fontFamily: "'Syne', sans-serif", letterSpacing: "0.02em" };

function resolveIcon(name: string): LucideIcon {
  const map = Icons as unknown as Record<string, LucideIcon>;
  return map[name] ?? Icons.Circle;
}

export function Sidebar() {
  const [org, setOrg] = useState<OrgType>("GovOrg");
  const identity = useIdentity();
  const network = useNetworkStatus();
  const nav = useNavActions(org);

  return (
    <aside className="w-[260px] shrink-0 border-r border-[#1F2733] bg-[#070A0F] flex flex-col">
      <div className="px-5 py-5 border-b border-[#1F2733]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 border border-[#3B82F6] flex items-center justify-center">
            <div className="w-2 h-2 bg-[#3B82F6]" />
          </div>
          <div>
            <div style={syne} className="text-[15px] text-white">REALTOKEN</div>
            <div style={mono} className="text-[10px] text-[#6B7280] tracking-widest">FABRIC.NETWORK</div>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 border-b border-[#1F2733]">
        <div style={mono} className="text-[10px] text-[#6B7280] tracking-widest mb-2">// ORG CONTEXT</div>
        <div className="grid grid-cols-2 gap-1 mb-3">
          {(["GovOrg", "BuyerOrg"] as OrgType[]).map((o) => (
            <button
              key={o}
              onClick={() => setOrg(o)}
              style={mono}
              className={`text-[11px] py-1.5 border transition-colors ${
                org === o
                  ? "bg-[#3B82F6] border-[#3B82F6] text-white"
                  : "bg-transparent border-[#1F2733] text-[#6B7280] hover:border-[#3B82F6]"
              }`}
            >
              {o.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div style={mono} className="text-[10px] text-[#6B7280]">MSP.ID</div>
          <div style={mono} className="text-[10px] text-[#E5E7EB]">
            {identity.loading ? "…" : identity.data?.mspId ?? "—"}
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <div style={mono} className="px-2 text-[10px] text-[#6B7280] tracking-widest mb-2">// ACTIONS</div>
        {nav.loading && <EmptyRow label="LOADING ACTIONS…" />}
        {nav.error && <EmptyRow label="POLICY ERROR" />}
        {nav.data?.length === 0 && <EmptyRow label="NO ACTIONS GRANTED" />}
        {nav.data?.map((item, i) => {
          const Icon = resolveIcon(item.icon);
          return (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-3 py-2.5 border-l-2 transition-colors ${
                i === 0
                  ? "border-[#3B82F6] bg-[#0F172A] text-white"
                  : "border-transparent text-[#9CA3AF] hover:bg-[#0F172A] hover:border-[#1F2733]"
              }`}
            >
              <Icon size={15} strokeWidth={1.5} />
              <span style={mono} className="text-[11px] tracking-wider">{item.label}</span>
              {item.primary && (
                <span style={mono} className="ml-auto text-[9px] text-[#3B82F6] border border-[#3B82F6]/40 px-1">PRI</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-[#1F2733] space-y-3">
        <div>
          <div style={mono} className="text-[10px] text-[#6B7280] tracking-widest mb-2">// NETWORK STATUS</div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {network.data?.connected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              )}
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: network.data?.connected ? "#10B981" : "#6B7280" }}
              />
            </span>
            <span style={mono} className="text-[10px]" >
              {network.loading
                ? "CONNECTING…"
                : network.data?.connected
                ? `${network.data.peerId}.CONNECTED`
                : "DISCONNECTED"}
            </span>
          </div>
          <div style={mono} className="text-[10px] text-[#6B7280] mt-1">
            {network.data
              ? `LATENCY: ${network.data.latencyMs}ms · BLOCK #${network.data.blockHeight.toLocaleString()}`
              : "—"}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-[#1F2733]">
          <div className="w-7 h-7 bg-[#1F2733] border border-[#3B82F6]/40 flex items-center justify-center">
            <Icons.Activity size={13} className="text-[#3B82F6]" />
          </div>
          <div className="flex-1 min-w-0">
            <div style={mono} className="text-[10px] text-white truncate">
              {identity.data?.walletShort ?? "—"}
            </div>
            <div style={mono} className="text-[9px] text-[#6B7280]">
              {identity.data?.role ?? "UNAUTHENTICATED"}
            </div>
          </div>
          <Icons.Settings size={13} className="text-[#6B7280]" />
        </div>
      </div>
    </aside>
  );
}

function EmptyRow({ label }: { label: string }) {
  return (
    <div style={mono} className="px-3 py-2 text-[10px] text-[#6B7280] tracking-widest">
      {label}
    </div>
  );
}
