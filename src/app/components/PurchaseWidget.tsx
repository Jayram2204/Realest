import { useMemo, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Panel } from "./ui/Panel";
import { AbacButton } from "./ui/AbacButton";
import { HashChip } from "./ui/HashChip";
import { cn, formatUSD } from "../lib/cn";
import { useTransferShares } from "../hooks/useChain";
import type { Property } from "../types/chain";

export function PurchaseWidget({ property }: { property: Property }) {
  const [shares, setShares] = useState<number>(1);
  const { submit, pending, result, reset } = useTransferShares();

  const clamped = Math.max(0, Math.min(shares, property.math.availableShares));
  const total = useMemo(() => clamped * property.math.pricePerShare, [clamped, property.math.pricePerShare]);

  const disabled = clamped <= 0 || property.status !== "LISTED";

  const onConfirm = async () => {
    await submit(property.assetId, clamped);
  };

  return (
    <Panel
      origin="onchain"
      title="// Purchase Widget"
      action={<span className="font-mono text-[10px] text-neutral-500">ABAC-GATED</span>}
    >
      <div className="space-y-4">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Share Count</span>
          <input
            type="number"
            min={1}
            max={property.math.availableShares}
            value={shares}
            onChange={(e) => setShares(Number(e.target.value))}
            className={cn(
              "mt-1 w-full border border-neutral-300 rounded-[2px] bg-white px-3 py-2",
              "font-mono text-[16px] text-neutral-900",
              "focus:outline-none focus:border-indigo-500",
            )}
          />
          <div className="flex items-center justify-between mt-1">
            <span className="font-mono text-[10px] text-neutral-400">
              Max: {property.math.availableShares.toLocaleString()}
            </span>
            <div className="flex gap-1">
              {[10, 50, 100].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setShares(n)}
                  className="border border-neutral-300 px-2 py-0.5 font-mono text-[10px] hover:bg-neutral-50 rounded-[2px]"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </label>

        <div className="border-t border-b border-neutral-300 py-3 space-y-1.5">
          <Row label="Price / Share" value={formatUSD(property.math.pricePerShare)} />
          <Row label="Shares" value={clamped.toLocaleString()} />
          <Row label="Gas (est.)" value="$0.00 (permissioned)" />
          <Row label="Total Cost" value={formatUSD(total)} emphasis />
        </div>

        {!result ? (
          <AbacButton
            capability="PURCHASE_SHARES"
            variant="primary"
            onClick={onConfirm}
            disabled={disabled || pending}
            className="w-full justify-center !bg-indigo-600 hover:!bg-indigo-700 !border-indigo-600"
          >
            {pending ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Broadcasting…
              </>
            ) : (
              <>Confirm Transaction →</>
            )}
          </AbacButton>
        ) : (
          <div className="border border-emerald-300 bg-emerald-50 rounded-[2px] p-3 space-y-2">
            <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-700">
              <Check size={14} /> COMMITTED TO LEDGER
            </div>
            <HashChip value={result.txHash} label="TX_HASH" />
            <div className="font-mono text-[10px] text-neutral-500">BLOCK #{result.blockHeight.toLocaleString()}</div>
            <button
              onClick={reset}
              className="font-mono text-[10px] uppercase tracking-widest text-indigo-600 hover:underline"
            >
              New transaction →
            </button>
          </div>
        )}
      </div>
    </Panel>
  );
}

function Row({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">{label}</span>
      <span className={cn("font-mono", emphasis ? "text-[16px] text-neutral-900" : "text-[11px] text-neutral-700")}>
        {value}
      </span>
    </div>
  );
}
