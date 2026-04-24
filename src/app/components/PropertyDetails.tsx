import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MapPin, ShieldCheck } from "lucide-react";
import { ChainStateCard } from "./ChainStateCard";
import { FractionalMathCard } from "./FractionalMathCard";
import { TransactionTimeline } from "./TransactionTimeline";
import { AssetLedgerTable } from "./AssetLedgerTable";
import { CertificateHeader } from "./CertificateHeader";
import { StatusBadge } from "./StatusBadge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useProperty } from "../hooks/useChain";

const mono = { fontFamily: "'Space Mono', monospace" };
const syne = { fontFamily: "'Syne', sans-serif", letterSpacing: "0.01em" };

function resolveIcon(name: string): LucideIcon {
  const map = Icons as unknown as Record<string, LucideIcon>;
  return map[name] ?? Icons.Circle;
}

export function PropertyDetails({ assetId }: { assetId: string }) {
  const { data: property, loading, error } = useProperty(assetId);

  return (
    <div className="min-h-full">
      <CertificateHeader
        txHash={property?.mintTxHash}
        blockHeight={property?.blockHeight}
        channel={property?.channel}
        loading={loading}
      />

      <div className="px-8 py-6 border-b border-[#1F2733]">
        <div className="flex items-center gap-2 mb-3">
          {property && <StatusBadge status={property.status} />}
          <span style={mono} className="text-[10px] text-[#6B7280]">ASSET_ID: {assetId}</span>
          {property && (
            <>
              <span style={mono} className="text-[10px] text-[#6B7280]">·</span>
              <span style={mono} className="text-[10px] text-[#6B7280]">MINTED: {property.mintedAt}</span>
            </>
          )}
        </div>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1 style={syne} className="text-[32px] text-white leading-tight">
              {loading ? "Loading…" : error ? "Asset unavailable" : property?.title ?? "—"}
            </h1>
            {property && (
              <div className="flex items-center gap-4 mt-2 text-[#9CA3AF]">
                <span className="flex items-center gap-1.5 text-[13px]">
                  <MapPin size={13} /> {property.address.district} · {property.address.zip}
                </span>
                <span style={mono} className="text-[11px] text-[#6B7280]">
                  LAT {property.address.lat} · LON {property.address.lon}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {property?.chain && (
              <div className="flex items-center gap-1 px-2 py-1 border border-[#10B981]/40 bg-[#10B981]/5">
                <ShieldCheck size={12} className="text-[#10B981]" />
                <span style={mono} className="text-[10px] text-[#10B981]">ABAC.VERIFIED</span>
              </div>
            )}
            <button
              disabled={!property || property.status !== "LISTED"}
              style={mono}
              className="text-[11px] px-4 py-2 bg-[#3B82F6] text-white hover:bg-[#2563EB] disabled:bg-[#1F2733] disabled:text-[#6B7280] tracking-wider"
            >
              PURCHASE SHARES →
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-10 gap-0 border-b border-[#1F2733]">
        <div className="col-span-7 p-8 border-r border-[#1F2733]">
          <ImageGrid images={property?.images ?? []} loading={loading} />
          <SpecsRow specs={property?.specs ?? []} />
          <Metadata description={property?.description} cid={property?.metadataCid} />
        </div>

        <div className="col-span-3 p-6 bg-[#070A0F] space-y-6">
          <FractionalMathCard data={property?.math ?? null} loading={loading} />
          <ChainStateCard data={property?.chain ?? null} loading={loading} />
        </div>
      </div>

      <div className="grid grid-cols-10 gap-0">
        <div className="col-span-6 p-8 border-r border-[#1F2733]">
          <SectionHeader title="Scroll of Truth" sub={`// GetPropertyHistory(${assetId})`} right={`${property?.history.length ?? 0} ENTRIES`} />
          <TransactionTimeline events={property?.history ?? []} loading={loading} />
        </div>
        <div className="col-span-4 p-8">
          <SectionHeader title="Asset Ledger" sub="// QueryProperty.shareholders" />
          <AssetLedgerTable
            rows={property?.shareholders ?? []}
            others={property?.otherHolders}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

function ImageGrid({ images, loading }: { images: import("../types/chain").PropertyImage[]; loading?: boolean }) {
  const [hero, ...rest] = images;
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-2 h-[420px] mb-6">
      <div className="col-span-2 row-span-2 relative overflow-hidden border border-[#1F2733] bg-[#0F172A]">
        {hero ? (
          <ImageWithFallback src={hero.url} alt={hero.alt} className="w-full h-full object-cover" />
        ) : (
          <Placeholder label={loading ? "LOADING…" : "NO MEDIA"} />
        )}
        {hero && (
          <div className="absolute bottom-3 left-3">
            <span style={mono} className="text-[10px] bg-black/70 text-white px-2 py-1 border border-white/20">
              {hero.id} · {hero.width}x{hero.height}
            </span>
          </div>
        )}
      </div>
      {[0, 1].map((i) => {
        const img = rest[i];
        return (
          <div key={i} className="relative overflow-hidden border border-[#1F2733] bg-[#0F172A]">
            {img ? (
              <ImageWithFallback src={img.url} alt={img.alt} className="w-full h-full object-cover" />
            ) : (
              <Placeholder label="—" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div style={mono} className="w-full h-full flex items-center justify-center text-[10px] text-[#6B7280] tracking-widest">
      {label}
    </div>
  );
}

function SpecsRow({ specs }: { specs: import("../types/chain").PropertySpec[] }) {
  if (!specs.length) {
    return (
      <div style={mono} className="border-t border-b border-[#1F2733] py-6 text-center text-[10px] text-[#6B7280] tracking-widest">
        NO SPECS AVAILABLE
      </div>
    );
  }
  return (
    <div className="grid grid-cols-4 gap-0 border-t border-b border-[#1F2733]">
      {specs.map((s, i) => {
        const Icon = resolveIcon(s.icon);
        return (
          <div key={s.key} className={`py-4 px-3 ${i < specs.length - 1 ? "border-r border-[#1F2733]" : ""}`}>
            <div className="flex items-center gap-2 mb-1">
              <Icon size={12} className="text-[#6B7280]" />
              <span style={mono} className="text-[10px] text-[#6B7280] tracking-widest">{s.label}</span>
            </div>
            <div style={syne} className="text-[22px] text-white">{s.value}</div>
          </div>
        );
      })}
    </div>
  );
}

function Metadata({ description, cid }: { description?: string; cid?: string }) {
  return (
    <div className="mt-6">
      <div style={mono} className="text-[10px] text-[#6B7280] tracking-widest mb-2">// OFF-CHAIN METADATA · IPFS</div>
      <p className="text-[#9CA3AF] text-[14px] leading-relaxed">{description ?? "—"}</p>
      {cid && <div style={mono} className="text-[10px] text-[#6B7280] mt-3">METADATA_CID: {cid}</div>}
    </div>
  );
}

function SectionHeader({ title, sub, right }: { title: string; sub: string; right?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 style={syne} className="text-[18px] text-white">{title}</h2>
        <div style={mono} className="text-[10px] text-[#6B7280] tracking-widest mt-1">{sub}</div>
      </div>
      {right && <span style={mono} className="text-[10px] text-[#6B7280]">{right}</span>}
    </div>
  );
}
