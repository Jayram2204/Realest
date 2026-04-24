import { ArrowLeft, MapPin, ShieldCheck } from "lucide-react";
import { RegistryHeader } from "../components/RegistryHeader";
import { PropertyHero } from "../components/PropertyHero";
import { PropertySpecs } from "../components/PropertySpecs";
import { TransactionTimeline } from "../components/TransactionTimeline";
import { FractionalMathCard } from "../components/FractionalMathCard";
import { PurchaseWidget } from "../components/PurchaseWidget";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Panel } from "../components/ui/Panel";
import { HashChip } from "../components/ui/HashChip";
import { useProperty } from "../hooks/useChain";

export function ViewDetailsPage({ assetId, onBack }: { assetId: string | null; onBack: () => void }) {
  const { data: property, loading, error } = useProperty(assetId ?? "");

  if (!assetId) {
    return <EmptyState message="No asset selected. Return to the dashboard and choose a property." onBack={onBack} />;
  }

  return (
    <div className="px-6 py-6 space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-neutral-600 hover:text-neutral-900"
      >
        <ArrowLeft size={12} /> Back to Dashboard
      </button>

      {loading && (
        <div className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 py-20 text-center">
          Querying asset {assetId}…
        </div>
      )}
      {error && <EmptyState message={`Ledger error: ${error.message}`} onBack={onBack} />}

      {property && (
        <>
          <RegistryHeader
            txHash={property.mintTxHash}
            blockHeight={property.blockHeight}
            channel={property.channel}
            chaincode="real-estate-cc@v2.1.4"
          />

          <section className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={property.status} />
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                  ASSET_ID: {property.assetId}
                </span>
                <span className="font-mono text-[10px] text-neutral-400">·</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                  MINTED: {new Date(property.mintedAt).toISOString().slice(0, 10)}
                </span>
              </div>
              <h1 className="font-sans font-semibold text-[30px] leading-tight text-neutral-900 tracking-tight">
                {property.title}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="inline-flex items-center gap-1.5 font-sans text-[13px] text-neutral-600">
                  <MapPin size={13} className="text-neutral-400" />
                  {property.district} · {property.zip}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 border border-sky-300 bg-sky-50 rounded-[2px] px-2 py-1.5">
              <ShieldCheck size={12} className="text-sky-600" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-sky-700">ABAC.VERIFIED</span>
            </div>
          </section>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <PropertyHero property={property} />
              <PropertySpecs property={property} />

              <Panel origin="offchain" title="// Off-Chain Metadata · IPFS" subtitle={`CID: ${property.metadataCid}`}>
                <p className="font-sans text-[14px] leading-relaxed text-neutral-700">{property.description}</p>
              </Panel>

              <Panel
                origin="onchain"
                title="// Transaction Timeline"
                subtitle={`GetPropertyHistory(${property.assetId})`}
                action={
                  <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                    {property.history.length} entries
                  </span>
                }
              >
                <TransactionTimeline events={property.history} />
              </Panel>
            </div>

            <aside className="col-span-12 lg:col-span-4 space-y-6 lg:sticky lg:top-[76px] self-start">
              <FractionalMathCard data={property.math} />
              <PurchaseWidget property={property} />
              <Panel origin="neutral" title="// Data Provenance">
                <dl className="space-y-2 font-mono text-[10px]">
                  <Row label="Channel" value={property.channel} />
                  <Row label="Block Height" value={`#${property.blockHeight.toLocaleString()}`} />
                  <Row label="Metadata CID" value={property.metadataCid} mono />
                  <div className="pt-2 border-t border-neutral-300">
                    <HashChip value={property.mintTxHash} label="MINT" link />
                  </div>
                </dl>
              </Panel>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState({ message, onBack }: { message: string; onBack: () => void }) {
  return (
    <div className="px-6 py-20 text-center">
      <div className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">{message}</div>
      <button
        onClick={onBack}
        className="mt-4 inline-flex items-center gap-2 border border-neutral-300 rounded-[2px] px-3 py-1.5 font-sans text-[12px] hover:bg-neutral-900 hover:text-white hover:border-neutral-900"
      >
        <ArrowLeft size={12} /> Return
      </button>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="uppercase tracking-widest text-neutral-500 shrink-0">{label}</dt>
      <dd className={mono ? "text-indigo-600 break-all text-right" : "text-neutral-900 text-right"}>{value}</dd>
    </div>
  );
}
