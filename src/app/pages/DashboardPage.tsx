import { useMemo, useState } from "react";
import { Briefcase, Layers, TrendingUp } from "lucide-react";
import { Panel } from "../components/ui/Panel";
import { PropertyCard } from "../components/PropertyCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { HashChip } from "../components/ui/HashChip";
import { useIdentity, usePortfolio, useProperties } from "../hooks/useChain";
import { formatUSD } from "../lib/cn";
import type { PropertyStatus } from "../types/chain";

const FILTERS: (PropertyStatus | "ALL")[] = ["ALL", "LISTED", "VERIFIED", "PENDING", "SOLD_OUT"];

export function DashboardPage({ onOpen }: { onOpen: (assetId: string) => void }) {
  const identity = useIdentity();
  const { data: properties, loading } = useProperties();
  const { data: portfolio } = usePortfolio();
  const [filter, setFilter] = useState<(PropertyStatus | "ALL")>("ALL");

  const visible = useMemo(
    () => (properties ?? []).filter((p) => filter === "ALL" || p.status === filter),
    [properties, filter],
  );

  const kpis = useMemo(() => {
    const total = properties?.reduce((s, p) => s + p.totalValuation, 0) ?? 0;
    const listed = properties?.filter((p) => p.status === "LISTED").length ?? 0;
    const portfolioValue = portfolio?.reduce((s, p) => s + p.currentValue, 0) ?? 0;
    return { total, listed, portfolioValue };
  }, [properties, portfolio]);

  return (
    <div className="px-6 py-6 space-y-6">
      <div>
        <h1 className="font-sans font-semibold text-[26px] text-neutral-900 tracking-tight">
          {greetingFor(identity.data?.role)}
        </h1>
        <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-500 mt-1">
          {identity.data?.mspId ?? "—"} · ABAC:{" "}
          {(identity.data?.abacAttributes ?? []).join(" · ")}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Kpi
          icon={<Layers size={14} />}
          label="Total Market Valuation"
          value={formatUSD(kpis.total)}
          sub={`${properties?.length ?? 0} assets on ledger`}
        />
        <Kpi
          icon={<TrendingUp size={14} />}
          label="Active Listings"
          value={kpis.listed.toString()}
          sub="Status = LISTED"
        />
        <Kpi
          icon={<Briefcase size={14} />}
          label="My Portfolio Value"
          value={formatUSD(kpis.portfolioValue)}
          sub={`${portfolio?.length ?? 0} positions`}
        />
      </div>

      <Panel
        origin="offchain"
        title="// Marketplace"
        subtitle="QueryProperty(*) · real-estate-cc"
        action={
          <div className="flex gap-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`border rounded-[2px] px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest ${
                  filter === f
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        }
      >
        {loading ? (
          <div className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 py-8 text-center">
            Querying ledger…
          </div>
        ) : visible.length === 0 ? (
          <div className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 py-8 text-center">
            No assets match filter
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {visible.map((p) => (
              <PropertyCard key={p.assetId} property={p} onOpen={() => onOpen(p.assetId)} />
            ))}
          </div>
        )}
      </Panel>

      <Panel origin="onchain" title="// My Portfolio" subtitle="GetClientIdentity().holdings">
        {!portfolio?.length ? (
          <div className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 py-6 text-center">
            No positions
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            <div className="grid grid-cols-[2fr_0.6fr_1fr_1fr_0.6fr_auto] gap-4 pb-2 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
              <div>Asset</div>
              <div className="text-right">Shares</div>
              <div className="text-right">Price</div>
              <div className="text-right">Value</div>
              <div className="text-right">%</div>
              <div />
            </div>
            {portfolio.map((p) => (
              <div
                key={p.assetId}
                className="grid grid-cols-[2fr_0.6fr_1fr_1fr_0.6fr_auto] gap-4 py-2 items-center"
              >
                <div className="min-w-0">
                  <div className="font-sans text-[13px] text-neutral-900 truncate">{p.title}</div>
                  <div className="font-mono text-[10px] text-neutral-500">{p.assetId}</div>
                </div>
                <div className="font-mono text-[12px] text-right">{p.shares.toLocaleString()}</div>
                <div className="font-mono text-[12px] text-right">{formatUSD(p.pricePerShare)}</div>
                <div className="font-mono text-[12px] text-right">{formatUSD(p.currentValue)}</div>
                <div className="font-mono text-[12px] text-right text-emerald-600">{p.pctOwned.toFixed(2)}%</div>
                <div className="flex justify-end">
                  <button
                    onClick={() => onOpen(p.assetId)}
                    className="font-mono text-[10px] uppercase tracking-widest text-indigo-600 hover:underline"
                  >
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel origin="onchain" title="// Recent Registry Mints" subtitle="listProperties()">
        <div className="space-y-2">
          {(properties ?? []).slice(0, 4).map((p) => (
            <div
              key={p.assetId}
              className="grid grid-cols-[auto_2fr_1fr_auto] items-center gap-4 border border-neutral-200 bg-white px-3 py-2 rounded-[2px]"
            >
              <StatusBadge status={p.status} />
              <div className="min-w-0">
                <div className="font-sans text-[12px] text-neutral-900 truncate">{p.title}</div>
                <div className="font-mono text-[10px] text-neutral-500">{p.assetId}</div>
              </div>
              <HashChip value={p.mintTxHash} label="MINT" />
              <button
                onClick={() => onOpen(p.assetId)}
                className="font-mono text-[10px] uppercase tracking-widest text-indigo-600 hover:underline"
              >
                Inspect →
              </button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="border border-neutral-300 bg-white rounded-[2px] px-4 py-4">
      <div className="flex items-center gap-2 text-neutral-500">
        {icon}
        <span className="font-mono text-[10px] uppercase tracking-widest">{label}</span>
      </div>
      <div className="font-mono text-[22px] text-neutral-900 mt-2">{value}</div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mt-1">{sub}</div>
    </div>
  );
}

function greetingFor(role?: string) {
  if (!role) return "Terminal";
  return `Welcome, ${role}`;
}
