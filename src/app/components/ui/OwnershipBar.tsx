import { cn } from "../../lib/cn";

interface Props {
  total: number;
  sold: number;
  mine?: number;
  height?: number;
  className?: string;
  showLegend?: boolean;
}

export function OwnershipBar({ total, sold, mine = 0, height = 10, className, showLegend = true }: Props) {
  const pctSold = clamp((sold - mine) / total * 100);
  const pctMine = clamp(mine / total * 100);
  const pctAvail = Math.max(0, 100 - pctSold - pctMine);

  const id = `mask-${Math.abs(hash(`${total}-${sold}-${mine}`))}`;

  return (
    <div className={cn("space-y-1.5", className)}>
      <svg width="100%" height={height} className="block rounded-[2px] border border-neutral-300 overflow-hidden">
        <defs>
          <linearGradient id={`${id}-sold`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#0A0A0A" />
            <stop offset="100%" stopColor="#404040" />
          </linearGradient>
          <linearGradient id={`${id}-mine`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#4338CA" />
          </linearGradient>
          <linearGradient id={`${id}-avail`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <mask id={id}>
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
          </mask>
        </defs>
        <g mask={`url(#${id})`}>
          <rect x="0" y="0" width={`${pctSold}%`} height="100%" fill={`url(#${id}-sold)`} />
          <rect x={`${pctSold}%`} y="0" width={`${pctMine}%`} height="100%" fill={`url(#${id}-mine)`} />
          <rect x={`${pctSold + pctMine}%`} y="0" width={`${pctAvail}%`} height="100%" fill={`url(#${id}-avail)`} />
        </g>
      </svg>
      {showLegend && (
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-neutral-500">
          <span className="inline-flex items-center gap-1.5"><Dot color="#0A0A0A" /> Sold {pctSold.toFixed(1)}%</span>
          {pctMine > 0 && (
            <span className="inline-flex items-center gap-1.5"><Dot color="#6366F1" /> Mine {pctMine.toFixed(1)}%</span>
          )}
          <span className="inline-flex items-center gap-1.5"><Dot color="#10B981" /> Avail {pctAvail.toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return <span className="w-1.5 h-1.5 rounded-[1px] inline-block" style={{ background: color }} />;
}

function clamp(n: number) { return Math.max(0, Math.min(100, n)); }
function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h;
}
