import { cn } from "../../lib/cn";
import type { PropertyStatus } from "../../types/chain";

const MAP: Record<PropertyStatus, { label: string; cls: string; dot: string }> = {
  PENDING: { label: "PENDING", cls: "border-neutral-300 text-neutral-600 bg-neutral-50", dot: "bg-neutral-400" },
  VERIFIED: { label: "VERIFIED", cls: "border-sky-500 text-sky-600 bg-sky-50", dot: "bg-sky-500" },
  LISTED: { label: "LISTED", cls: "border-emerald-500 text-emerald-600 bg-emerald-50", dot: "bg-emerald-500" },
  SOLD_OUT: { label: "SOLD OUT", cls: "border-red-600 text-red-600 bg-red-50", dot: "bg-red-600" },
};

export function StatusBadge({ status, className }: { status: PropertyStatus; className?: string }) {
  const m = MAP[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border rounded-[2px] px-2 py-1 font-mono text-[10px] tracking-widest",
        m.cls,
        className,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}
