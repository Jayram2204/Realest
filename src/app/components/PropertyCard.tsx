import { ArrowUpRight } from "lucide-react";
import { StatusBadge } from "./ui/StatusBadge";
import { HashChip } from "./ui/HashChip";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { formatUSD } from "../lib/cn";
import type { PropertySummary } from "../types/chain";

interface Props {
  property: PropertySummary;
  onOpen: () => void;
}

export function PropertyCard({ property, onOpen }: Props) {
  const pctAvail = (property.availableShares / property.totalShares) * 100;
  return (
    <article className="group border border-neutral-300 rounded-[2px] bg-white flex flex-col hover:border-neutral-900 transition-colors">
      <div className="relative border-b border-neutral-300 aspect-[5/3] overflow-hidden bg-neutral-100">
        <ImageWithFallback
          src={property.thumbnailUrl}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <StatusBadge status={property.status} />
        </div>
      </div>

      <div className="px-4 py-3 border-b border-neutral-300">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-sans font-semibold text-[15px] text-neutral-900 leading-tight truncate">
              {property.title}
            </h3>
            <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mt-0.5 truncate">
              {property.district} · {property.zip}
            </div>
          </div>
          <button
            onClick={onOpen}
            className="shrink-0 border border-neutral-300 rounded-[2px] p-1.5 hover:bg-neutral-900 hover:text-white hover:border-neutral-900"
            aria-label="Open"
          >
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      <dl className="grid grid-cols-2 bg-indigo-50/40">
        <Stat label="Price/Share" value={formatUSD(property.pricePerShare)} border />
        <Stat label="Est. APY" value={`${property.estApy.toFixed(2)}%`} />
        <Stat label="Valuation" value={formatUSD(property.totalValuation)} border top />
        <Stat label="Available" value={`${pctAvail.toFixed(0)}%`} top />
      </dl>

      <div className="px-4 py-2 border-t border-neutral-300 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
          {property.assetId}
        </span>
        <HashChip value={property.mintTxHash} />
      </div>
    </article>
  );
}

function Stat({ label, value, border, top }: { label: string; value: string; border?: boolean; top?: boolean }) {
  return (
    <div className={`px-4 py-2 ${border ? "border-r border-neutral-300" : ""} ${top ? "border-t border-neutral-300" : ""}`}>
      <dt className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">{label}</dt>
      <dd className="font-mono text-[13px] text-neutral-900 mt-0.5">{value}</dd>
    </div>
  );
}
