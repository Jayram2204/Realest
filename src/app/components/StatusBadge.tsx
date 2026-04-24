import type { PropertyStatus } from "../types/chain";

const mono = { fontFamily: "'Space Mono', monospace" };

const MAP: Record<PropertyStatus, string> = {
  PENDING: "border-[#6B7280] text-[#9CA3AF] bg-[#6B7280]/10",
  VERIFIED: "border-[#3B82F6] text-[#3B82F6] bg-[#3B82F6]/10",
  LISTED: "border-[#10B981] text-[#10B981] bg-[#10B981]/10",
  SOLD_OUT: "border-[#EF4444] text-[#EF4444] bg-[#EF4444]/10",
};

export function StatusBadge({ status }: { status: PropertyStatus }) {
  return (
    <span style={mono} className={`text-[10px] px-2 py-1 border tracking-widest ${MAP[status]}`}>
      ● {status}
    </span>
  );
}
