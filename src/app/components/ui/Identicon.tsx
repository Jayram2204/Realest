import { useMemo } from "react";
import { cn } from "../../lib/cn";

function hashToBytes(s: string): number[] {
  const clean = s.replace(/^0x/, "");
  const out: number[] = [];
  for (let i = 0; i < clean.length; i += 2) out.push(parseInt(clean.slice(i, i + 2), 16) || 0);
  while (out.length < 16) out.push((out.length * 31 + (out[0] ?? 7)) & 0xff);
  return out;
}

const PALETTES = [
  ["#0EA5E9", "#0284C7"],
  ["#10B981", "#059669"],
  ["#6366F1", "#4338CA"],
  ["#F59E0B", "#D97706"],
  ["#DC2626", "#991B1B"],
  ["#0A0A0A", "#404040"],
];

interface Props {
  value: string;
  size?: number;
  className?: string;
}

export function Identicon({ value, size = 32, className }: Props) {
  const cells = useMemo(() => {
    const bytes = hashToBytes(value);
    const palette = PALETTES[bytes[0] % PALETTES.length];
    const grid: { x: number; y: number; fill: string }[] = [];
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 3; x++) {
        const b = bytes[(y * 3 + x) % bytes.length];
        if (b % 2 === 0) {
          const fill = b % 7 === 0 ? palette[1] : palette[0];
          grid.push({ x, y, fill });
          grid.push({ x: 4 - x, y, fill });
        }
      }
    }
    return { grid, palette };
  }, [value]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 5 5"
      shapeRendering="crispEdges"
      className={cn("border border-neutral-300 bg-white rounded-[2px]", className)}
      aria-label={`Identicon for ${value}`}
    >
      {cells.grid.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width={1} height={1} fill={c.fill} />
      ))}
    </svg>
  );
}
