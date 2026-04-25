import { useMemo } from "react";
import type { PortfolioPosition } from "../types/chain";
import { formatUSD } from "../lib/cn";

interface Props {
  positions: PortfolioPosition[];
  onSelect: (assetId: string) => void;
}

export function PortfolioConstellation({ positions, onSelect }: Props) {
  const W = 720;
  const H = 360;

  const nodes = useMemo(() => {
    const cx = W / 2;
    const cy = H / 2;
    const total = positions.reduce((s, p) => s + p.currentValue, 0) || 1;
    return positions.map((p, i) => {
      const angle = (i / positions.length) * Math.PI * 2 - Math.PI / 2;
      const r = 80 + (p.currentValue / total) * 90;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      const radius = 14 + Math.sqrt(p.currentValue) / 8;
      return { ...p, x, y, radius };
    });
  }, [positions]);

  if (!positions.length) {
    return (
      <div className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 py-12 text-center">
        No positions to map
      </div>
    );
  }

  return (
    <div className="border border-neutral-300 rounded-[2px] bg-[radial-gradient(circle_at_center,#FFFFFF_0%,#F4F4F5_100%)] overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[360px]">
        <g opacity={0.25}>
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`h-${i}`} x1={0} x2={W} y1={(H / 8) * i} y2={(H / 8) * i} stroke="#D4D4D4" strokeDasharray="2 4" />
          ))}
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={`v-${i}`} y1={0} y2={H} x1={(W / 16) * i} x2={(W / 16) * i} stroke="#D4D4D4" strokeDasharray="2 4" />
          ))}
        </g>
        <circle cx={W / 2} cy={H / 2} r={6} fill="#0A0A0A" />
        <circle cx={W / 2} cy={H / 2} r={14} fill="none" stroke="#0A0A0A" strokeOpacity={0.2} />
        {nodes.map((n) => (
          <line key={`l-${n.assetId}`} x1={W / 2} y1={H / 2} x2={n.x} y2={n.y} stroke="#6366F1" strokeOpacity={0.35} strokeDasharray="3 3" />
        ))}
        {nodes.map((n) => (
          <g key={n.assetId} className="cursor-pointer" onClick={() => onSelect(n.assetId)}>
            <circle cx={n.x} cy={n.y} r={n.radius + 6} fill="#6366F1" fillOpacity={0.06} />
            <circle cx={n.x} cy={n.y} r={n.radius} fill="white" stroke="#6366F1" strokeWidth={1.5} />
            <text x={n.x} y={n.y + 3} textAnchor="middle" className="font-mono" fontSize={10} fill="#0A0A0A">
              {n.shares}
            </text>
            <text x={n.x} y={n.y + n.radius + 14} textAnchor="middle" className="font-mono" fontSize={9} fill="#525252">
              {n.assetId.split("-")[1]}
            </text>
            <text x={n.x} y={n.y + n.radius + 26} textAnchor="middle" className="font-mono" fontSize={9} fill="#10B981">
              {formatUSD(n.currentValue)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
