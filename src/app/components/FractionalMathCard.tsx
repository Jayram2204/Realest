import { Panel } from "./ui/Panel";
import { formatUSD } from "../lib/cn";
import type { FractionalMath } from "../types/chain";

export function FractionalMathCard({ data, loading }: { data: FractionalMath | null; loading?: boolean }) {
  const pct = data ? (data.availableShares / data.totalShares) * 100 : 0;

  return (
    <Panel
      origin="onchain"
      title="// Fractional Math"
      action={<span className="font-mono text-[10px] text-emerald-600">{loading ? "SYNC…" : "LIVE"}</span>}
    >
      <div className="space-y-5">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Total Valuation</div>
          <div className="font-mono text-[28px] leading-none text-neutral-900">
            {data ? formatUSD(data.totalValuation) : "—"}
            {data && <span className="text-neutral-400 text-[14px] ml-2">{data.currency}</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 border-t border-b border-neutral-300">
          <Cell label="Price / Share" value={data ? formatUSD(data.pricePerShare) : "—"} border />
          <Cell label="Denomination" value={data ? data.totalShares.toLocaleString() : "—"} />
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Available / Total</span>
            <span className="font-mono text-[11px] text-neutral-900">
              {data ? `${data.availableShares.toLocaleString()} / ${data.totalShares.toLocaleString()}` : "— / —"}
            </span>
          </div>
          <div className="h-2 border border-neutral-300 bg-neutral-100 relative overflow-hidden rounded-[2px]">
            <div className="absolute inset-y-0 left-0 bg-emerald-500" style={{ width: `${pct}%` }} />
          </div>
          <div className="font-mono text-[10px] text-neutral-500 mt-1">{pct.toFixed(2)}% available</div>
        </div>

        <dl className="space-y-1.5">
          <Row label="Est. APY" value={data ? `${data.estApy.toFixed(2)}%` : "—"} highlight />
          <Row label="Yield Freq." value={data?.yieldFrequency ?? "—"} />
          <Row label="Min. Investment" value={data ? formatUSD(data.minInvestment) : "—"} />
        </dl>
      </div>
    </Panel>
  );
}

function Cell({ label, value, border }: { label: string; value: string; border?: boolean }) {
  return (
    <div className={border ? "py-3 pr-3 border-r border-neutral-300" : "py-3 pl-3"}>
      <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-1">{label}</div>
      <div className="font-mono text-[18px] text-neutral-900">{value}</div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">{label}</dt>
      <dd className={`font-mono text-[12px] ${highlight ? "text-emerald-600" : "text-neutral-900"}`}>{value}</dd>
    </div>
  );
}
