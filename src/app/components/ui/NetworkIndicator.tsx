import { cn } from "../../lib/cn";
import { useNetworkStatus } from "../../hooks/useChain";
import { useBlockPulse } from "../../hooks/useBlockPulse";

export function NetworkIndicator({ className }: { className?: string }) {
  const { data, loading } = useNetworkStatus();
  const { block } = useBlockPulse();
  const ok = !!data?.connected;

  return (
    <div className={cn("flex items-center gap-2 border border-neutral-300 bg-white rounded-[2px] px-3 py-1.5", className)}>
      <span className="relative flex h-2 w-2">
        {ok && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />}
        <span className={cn("relative inline-flex rounded-full h-2 w-2", ok ? "bg-emerald-500" : "bg-neutral-400")} />
      </span>
      <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-700">
        {loading ? "Connecting…" : ok ? "Connected to Fabric Network" : "Disconnected"}
      </span>
      {data && (
        <span className="font-mono text-[10px] text-neutral-400 border-l border-neutral-300 pl-2">
          BLK #{block.toLocaleString()} · {data.latencyMs}ms
        </span>
      )}
    </div>
  );
}
