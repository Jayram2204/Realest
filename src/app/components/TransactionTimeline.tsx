import { cn } from "../lib/cn";
import { HashChip } from "./ui/HashChip";
import type { TxEvent, TxEventType } from "../types/chain";

const COLORS: Record<TxEventType, string> = {
  GENESIS: "bg-neutral-400",
  MINT: "bg-indigo-500",
  APPRAISE: "bg-amber-500",
  VERIFY: "bg-sky-500",
  LIST: "bg-emerald-500",
  SALE: "bg-emerald-600",
  TRANSFER: "bg-indigo-500",
};

export function TransactionTimeline({ events, loading }: { events: TxEvent[]; loading?: boolean }) {
  if (loading) return <Empty label="Loading history…" />;
  if (!events.length) return <Empty label="No events recorded" />;

  return (
    <ol className="border border-neutral-300 rounded-[2px] bg-white divide-y divide-neutral-200">
      {events.map((e, i) => (
        <li key={e.id} className="grid grid-cols-[120px_1fr] items-start">
          <div className="relative px-4 py-3 border-r border-neutral-200 bg-neutral-50/50">
            <div className="flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-[1px]", COLORS[e.type])} />
              <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-800">{e.type}</span>
            </div>
            {i < events.length - 1 && (
              <span className={cn("absolute left-[21px] top-[28px] bottom-[-12px] w-px", COLORS[e.type], "opacity-30")} />
            )}
          </div>
          <div className="px-4 py-3 min-w-0">
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="font-mono text-[10px] text-neutral-500">
                {new Date(e.timestamp).toISOString().replace("T", " ").slice(0, 19)} UTC
              </span>
              <HashChip value={e.txHash} />
            </div>
            <div className="font-mono text-[11px] text-neutral-900">
              {e.actorMsp}
              <span className="text-neutral-400"> · </span>
              <span className="text-neutral-500">{e.actorRole}</span>
            </div>
            <div className="font-mono text-[11px] text-neutral-600 mt-0.5">→ {e.meta}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="border border-neutral-300 rounded-[2px] bg-white px-4 py-10 text-center font-mono text-[11px] uppercase tracking-widest text-neutral-400">
      {label}
    </div>
  );
}
