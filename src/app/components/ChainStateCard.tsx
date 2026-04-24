import type { ChainState } from "../types/chain";

const mono = { fontFamily: "'Space Mono', monospace" };

export function ChainStateCard({ data, loading }: { data: ChainState | null; loading?: boolean }) {
  const pct = data ? (data.availableShares / data.totalShares) * 100 : 0;

  return (
    <div className="border border-[#1F2733] bg-[#0A0E14]">
      <div className="px-4 py-2 border-b border-[#1F2733] flex items-center justify-between">
        <span style={mono} className="text-[10px] text-[#6B7280] tracking-widest">// CHAIN-STATE</span>
        <div className="flex items-center gap-1">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: data?.synced ? "#10B981" : "#6B7280" }}
          />
          <span style={mono} className="text-[10px] text-[#10B981]">
            {loading ? "SYNC…" : data?.synced ? "SYNCED" : "STALE"}
          </span>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span style={mono} className="text-[10px] text-[#6B7280] tracking-widest">AVAILABLE / TOTAL</span>
            <span style={mono} className="text-[11px] text-white">
              {data ? `${data.availableShares.toLocaleString()} / ${data.totalShares.toLocaleString()}` : "— / —"}
            </span>
          </div>
          <div className="h-2 bg-[#1F2733] relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-[#10B981]" style={{ width: `${pct}%` }} />
          </div>
          <div style={mono} className="text-[10px] text-[#6B7280] mt-1">{pct.toFixed(2)}% AVAILABLE</div>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-[#1F2733] pt-3">
          <Stat label="HOLDERS" value={data ? data.holders.toLocaleString() : "—"} />
          <Stat label="24H.VOL" value={data ? `$${(data.volume24h / 1000).toFixed(1)}K` : "—"} />
          <Stat label="TX COUNT" value={data ? data.txCount.toLocaleString() : "—"} />
        </div>

        <div className="pt-3 border-t border-[#1F2733]">
          <div style={mono} className="text-[10px] text-[#6B7280] tracking-widest mb-1">CHAINCODE</div>
          <div style={mono} className="text-[10px] text-[#3B82F6] break-all">{data?.chaincode ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={mono} className="text-[9px] text-[#6B7280] tracking-widest">{label}</div>
      <div style={mono} className="text-[13px] text-white mt-0.5">{value}</div>
    </div>
  );
}
