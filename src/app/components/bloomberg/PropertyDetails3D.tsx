import { useState } from "react";
import { motion } from "motion/react";
import { Maximize2, Layers, TrendingUp, Users, MapPin, Calendar } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis } from "recharts";
import { Panel } from "../ui/Panel";
import { StatusBadge } from "../ui/StatusBadge";
import { formatUSD } from "../../lib/cn";

interface PropertyDetails3DProps {
  property: any;
}

export function PropertyDetails3D({ property }: PropertyDetails3DProps) {
  const [isRotating, setIsRotating] = useState(false);
  const [rotation, setRotation] = useState({ x: 20, y: 30 });

  // Mock ownership data for pie chart
  const ownershipData = [
    { name: "You", value: 150, color: "#6366f1" },
    { name: "Investors", value: 8500, color: "#94a3b8" },
    { name: "Available", value: 1350, color: "#e2e8f0" },
  ];

  // Mock price history
  const priceHistory = Array.from({ length: 90 }, (_, i) => ({
    day: i,
    price: property.totalValuation / 10000 + Math.sin(i * 0.1) * 50 + i * 2,
  }));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isRotating) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * -40;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * 40;
    setRotation({ x, y });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <StatusBadge status={property.status} />
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            {property.assetId}
          </span>
        </div>
        <h1 className="font-sans font-semibold text-[24px] text-neutral-900 dark:text-neutral-100 tracking-tight mb-2">
          {property.title}
        </h1>
        <div className="flex items-center gap-4 text-neutral-600 dark:text-neutral-400">
          <span className="flex items-center gap-1.5 font-sans text-[13px]">
            <MapPin size={13} className="text-neutral-400" />
            {property.district} · {property.zip}
          </span>
          <span className="flex items-center gap-1.5 font-sans text-[13px]">
            <Calendar size={13} className="text-neutral-400" />
            Minted {new Date(property.mintedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* 2.5D Isometric Visualization */}
      <Panel origin="neutral" title="// Property Visualization">
        <div
          className="relative h-[300px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-[2px] cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsRotating(true)}
          onMouseLeave={() => {
            setIsRotating(false);
            setRotation({ x: 20, y: 30 });
          }}
        >
          <motion.div
            animate={{
              rotateX: rotation.x,
              rotateY: rotation.y,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            style={{
              transformStyle: "preserve-3d",
              perspective: "1000px",
            }}
            className="relative"
          >
            {/* Building representation */}
            <div
              style={{
                transform: "rotateX(-30deg) rotateZ(45deg)",
                transformStyle: "preserve-3d",
              }}
              className="relative"
            >
              {/* Base */}
              <div
                className="w-32 h-32 bg-gradient-to-br from-neutral-800 to-neutral-900 border-2 border-neutral-700"
                style={{
                  transform: "translateZ(-40px)",
                }}
              />

              {/* Front face */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-800 border-2 border-neutral-600 flex items-center justify-center"
                style={{
                  transform: "translateZ(40px)",
                }}
              >
                <div className="grid grid-cols-3 gap-2 p-4">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-amber-400/30 border border-amber-500/50" />
                  ))}
                </div>
              </div>

              {/* Side faces */}
              {[0, 1, 2, 3].map((i) => {
                const rotation = i * 90;
                return (
                  <div
                    key={i}
                    className="absolute inset-0 bg-gradient-to-br from-neutral-600 to-neutral-700 border-2 border-neutral-500 opacity-80"
                    style={{
                      transform: `rotateY(${rotation}deg) translateZ(64px)`,
                      width: "128px",
                      height: "80px",
                    }}
                  />
                );
              })}
            </div>

            {/* Floating info */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white border border-neutral-300 rounded-[2px] px-3 py-2 shadow-lg"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="font-mono text-[11px] font-semibold text-neutral-900">
                {formatUSD(property.totalValuation)}
              </div>
              <div className="font-mono text-[9px] text-neutral-500">Total Value</div>
            </motion.div>
          </motion.div>

          {/* Instructions */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-[2px]">
            <Maximize2 size={10} />
            <span className="font-mono text-[9px] uppercase tracking-widest">
              Drag to rotate
            </span>
          </div>
        </div>
      </Panel>

      {/* Grid layout for charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Ownership Breakdown */}
        <Panel origin="onchain" title="// Ownership Distribution">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart key="ownership-pie-chart">
                <Pie
                  key="ownership-pie"
                  data={ownershipData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {ownershipData.map((entry, index) => (
                    <Cell key={`ownership-cell-${entry.name}-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  key="ownership-tooltip"
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-neutral-900 text-white px-3 py-2 rounded-[2px]">
                        <div className="font-sans text-[11px] mb-1">{data.name}</div>
                        <div className="font-mono text-[10px]">
                          {data.value.toLocaleString()} shares
                        </div>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {ownershipData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">
                    {item.name}
                  </div>
                  <div className="font-mono text-[11px] text-neutral-900">
                    {((item.value / 10000) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Price History */}
        <Panel origin="offchain" title="// 90-Day Price History">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart key="price-history-chart" data={priceHistory}>
                <XAxis key="price-x-axis" dataKey="day" hide />
                <YAxis key="price-y-axis" hide domain={["dataMin - 50", "dataMax + 50"]} />
                <Tooltip
                  key="price-tooltip"
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    return (
                      <div className="bg-neutral-900 text-white px-2 py-1 rounded-[2px] font-mono text-[10px]">
                        {formatUSD(payload[0].value as number)}/share
                      </div>
                    );
                  }}
                />
                <Line
                  key="line-price-history"
                  type="monotone"
                  dataKey="price"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mb-0.5">
                Low
              </div>
              <div className="font-mono text-[11px] text-neutral-900">
                {formatUSD(Math.min(...priceHistory.map((p) => p.price)))}
              </div>
            </div>
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mb-0.5">
                Current
              </div>
              <div className="font-mono text-[11px] text-neutral-900">
                {formatUSD(property.totalValuation / 10000)}
              </div>
            </div>
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mb-0.5">
                High
              </div>
              <div className="font-mono text-[11px] text-neutral-900">
                {formatUSD(Math.max(...priceHistory.map((p) => p.price)))}
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* Property Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={<Layers size={14} />} label="Total Shares" value="10,000" />
        <StatCard
          icon={<Users size={14} />}
          label="Investors"
          value="127"
        />
        <StatCard
          icon={<TrendingUp size={14} />}
          label="Yield (APY)"
          value="8.4%"
          accent="emerald"
        />
        <StatCard
          icon={<Layers size={14} />}
          label="Liquidity"
          value="High"
          accent="sky"
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: "emerald" | "sky";
}) {
  const colors = accent
    ? accent === "emerald"
      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
      : "border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400"
    : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300";

  return (
    <div className={`border rounded-[2px] p-3 transition-colors ${colors}`}>
      <div className="flex items-center gap-1.5 mb-2 opacity-80">
        {icon}
        <span className="font-mono text-[9px] uppercase tracking-widest">{label}</span>
      </div>
      <div className="font-mono text-[18px] font-semibold text-neutral-900 dark:text-neutral-100">{value}</div>
    </div>
  );
}
