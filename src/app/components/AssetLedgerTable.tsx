import type { Shareholder } from "../types/chain";

const mono = { fontFamily: "'Space Mono', monospace" };

interface Props {
  rows: Shareholder[];
  others?: { count: number; shares: number; percentage: number };
  loading?: boolean;
}

export function AssetLedgerTable({ rows, others, loading }: Props) {
  return (
    <div className="border border-[#1F2733]">
      <div className="grid grid-cols-[1.6fr_0.8fr_0.6fr_1fr] border-b border-[#1F2733] bg-[#070A0F]">
        <Th>WALLET</Th>
        <Th right>SHARES</Th>
        <Th right>%</Th>
        <Th>ACQUIRED</Th>
      </div>

      {loading && <EmptyRow label="QUERYING LEDGER…" />}
      {!loading && rows.length === 0 && <EmptyRow label="NO SHAREHOLDERS" />}

      {rows.map((r, i) => (
        <div
          key={r.wallet}
          className={`grid grid-cols-[1.6fr_0.8fr_0.6fr_1fr] hover:bg-[#0F172A] ${
            i < rows.length - 1 ? "border-b border-[#1F2733]" : ""
          }`}
        >
          <Td><span className="text-[#3B82F6]">{r.wallet}</span></Td>
          <Td right>{r.shares.toLocaleString()}</Td>
          <Td right>{r.percentage.toFixed(2)}</Td>
          <Td>{r.acquiredAt}</Td>
        </div>
      ))}

      {others && others.count > 0 && (
        <div className="grid grid-cols-[1.6fr_0.8fr_0.6fr_1fr] border-t border-[#1F2733] bg-[#070A0F]">
          <Td><span className="text-[#6B7280]">+ {others.count} OTHER HOLDERS</span></Td>
          <Td right>{others.shares.toLocaleString()}</Td>
          <Td right>{others.percentage.toFixed(2)}</Td>
          <Td>—</Td>
        </div>
      )}
    </div>
  );
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <div style={mono} className={`text-[10px] text-[#6B7280] tracking-widest px-3 py-2 ${right ? "text-right" : ""}`}>
      {children}
    </div>
  );
}
function Td({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <div style={mono} className={`text-[11px] text-white px-3 py-2.5 ${right ? "text-right" : ""}`}>
      {children}
    </div>
  );
}
function EmptyRow({ label }: { label: string }) {
  return (
    <div style={mono} className="px-3 py-6 text-center text-[10px] text-[#6B7280] tracking-widest border-b border-[#1F2733] last:border-b-0">
      {label}
    </div>
  );
}
