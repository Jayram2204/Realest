import { ShieldCheck } from "lucide-react";
import { HashChip } from "./ui/HashChip";

interface Props {
  txHash: string;
  blockHeight: number;
  channel: string;
  chaincode?: string;
}

export function RegistryHeader({ txHash, blockHeight, channel, chaincode }: Props) {
  return (
    <div className="flex items-stretch border border-neutral-300 bg-white rounded-[2px] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-r border-neutral-300 bg-sky-50">
        <ShieldCheck size={14} className="text-sky-600" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-sky-700">
          Certificate of Authenticity
        </span>
      </div>
      <div className="flex-1 px-4 py-3 min-w-0 flex items-center">
        <HashChip value={txHash} label="MINT.TX_HASH" link />
      </div>
      <div className="flex items-center gap-6 px-4 py-3 border-l border-neutral-300">
        <Cell label="BLOCK" value={`#${blockHeight.toLocaleString()}`} />
        <Cell label="CHANNEL" value={channel} />
        {chaincode && <Cell label="CC" value={chaincode} />}
      </div>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">{label}</div>
      <div className="font-mono text-[11px] text-neutral-900">{value}</div>
    </div>
  );
}
