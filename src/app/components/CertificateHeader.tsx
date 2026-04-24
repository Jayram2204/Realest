import { Copy, ExternalLink, CheckCircle2 } from "lucide-react";

const mono = { fontFamily: "'Space Mono', monospace" };

interface Props {
  txHash?: string;
  blockHeight?: number;
  channel?: string;
  loading?: boolean;
}

export function CertificateHeader({ txHash, blockHeight, channel, loading }: Props) {
  return (
    <div className="border-b border-[#1F2733] bg-[#070A0F]">
      <div className="flex items-stretch">
        <div className="px-4 py-3 border-r border-[#1F2733] flex items-center gap-2 bg-[#3B82F6]/5">
          <CheckCircle2 size={14} className="text-[#3B82F6]" />
          <span style={mono} className="text-[10px] text-[#3B82F6] tracking-widest">CERTIFICATE OF AUTHENTICITY</span>
        </div>
        <div className="flex-1 px-4 py-3 flex items-center gap-3 overflow-hidden">
          <span style={mono} className="text-[10px] text-[#6B7280] tracking-widest shrink-0">MINT.TX_HASH</span>
          <span style={mono} className="text-[11px] text-white truncate">
            {loading ? "…" : txHash ?? "—"}
          </span>
          <button className="shrink-0 p-1 hover:bg-[#1F2733]"><Copy size={11} className="text-[#6B7280]"/></button>
          <button className="shrink-0 p-1 hover:bg-[#1F2733]"><ExternalLink size={11} className="text-[#6B7280]"/></button>
        </div>
        <div className="px-4 py-3 border-l border-[#1F2733] flex items-center gap-4">
          <div>
            <span style={mono} className="text-[10px] text-[#6B7280]">BLOCK</span>{" "}
            <span style={mono} className="text-[11px] text-white">
              {blockHeight ? `#${blockHeight.toLocaleString()}` : "—"}
            </span>
          </div>
          <div>
            <span style={mono} className="text-[10px] text-[#6B7280]">CH</span>{" "}
            <span style={mono} className="text-[11px] text-white">{channel ?? "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
