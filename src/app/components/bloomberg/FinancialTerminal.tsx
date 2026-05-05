import { useMemo } from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Panel } from "../ui/Panel";
import { usePortfolio } from "../../hooks/useChain";
import { formatUSD } from "../../lib/cn";

interface FinancialTerminalProps {
  onAction?: (action: "buy" | "sell" | "withdraw") => void;
}

export function FinancialTerminal({ onAction }: FinancialTerminalProps) {
  const { data: portfolio } = usePortfolio();

  const metrics = useMemo(() => {
    const totalValue = portfolio?.reduce((sum, p) => sum + p.currentValue, 0) ?? 0;
    const totalShares = portfolio?.reduce((sum, p) => sum + p.shares, 0) ?? 0;
    const claimableEarnings = totalShares * 0.0823; // Mock dividend rate

    // Generate mock historical data (30 days)
    const historicalData = Array.from({ length: 30 }, (_, i) => {
      const baseValue = totalValue * 0.8; // Start at 80% of current
      const growth = (totalValue - baseValue) * (i / 29);
      const noise = Math.sin(i * 0.5) * (totalValue * 0.02);
      return {
        day: i + 1,
        value: baseValue + growth + noise,
      };
    });

    const weekAgoValue = historicalData[historicalData.length - 8]?.value ?? totalValue;
    const weekChange = totalValue - weekAgoValue;
    const weekChangePercent = weekAgoValue > 0 ? (weekChange / weekAgoValue) * 100 : 0;

    return {
      totalValue,
      totalShares,
      claimableEarnings,
      weekChange,
      weekChangePercent,
      historicalData,
      positions: portfolio?.length ?? 0,
    };
  }, [portfolio]);

  return (
    <div className="space-y-4">
      {/* Portfolio Value Card */}
      <Panel origin="onchain" title="// Portfolio Performance" subtitle="Real-time valuation">
        <div className="space-y-4">
          {/* Main Value */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[28px] font-semibold text-neutral-900">
                {formatUSD(metrics.totalValue)}
              </span>
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-1 font-mono text-[12px] ${
                  metrics.weekChange >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {metrics.weekChange >= 0 ? (
                  <ArrowUpRight size={14} />
                ) : (
                  <ArrowDownRight size={14} />
                )}
                <span>
                  {formatUSD(Math.abs(metrics.weekChange))} ({Math.abs(metrics.weekChangePercent).toFixed(2)}%)
                </span>
              </motion.div>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mt-1">
              7-day change
            </div>
          </div>

          {/* Mini Chart */}
          <div className="h-[80px] -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart key="portfolio-chart" data={metrics.historicalData}>
                <XAxis key="portfolio-x-axis" dataKey="day" hide />
                <YAxis key="portfolio-y-axis" hide domain={["dataMin - 100", "dataMax + 100"]} />
                <Tooltip
                  key="portfolio-tooltip"
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    return (
                      <div className="bg-neutral-900 text-white px-2 py-1 rounded-[2px] font-mono text-[10px]">
                        {formatUSD(payload[0].value as number)}
                      </div>
                    );
                  }}
                />
                <Line
                  key="line-portfolio-value"
                  type="monotone"
                  dataKey="value"
                  stroke={metrics.weekChange >= 0 ? "#10b981" : "#ef4444"}
                  strokeWidth={2}
                  dot={false}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Panel>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <QuickStat
          icon={<DollarSign size={13} />}
          label="Claimable"
          value={formatUSD(metrics.claimableEarnings)}
          accent="emerald"
        />
        <QuickStat
          icon={<Briefcase size={13} />}
          label="Positions"
          value={metrics.positions.toString()}
          accent="sky"
        />
      </div>

      {/* Quick Actions */}
      <Panel origin="neutral" title="// Quick Actions">
        <div className="grid grid-cols-2 gap-2">
          <ActionButton
            label="Buy Shares"
            icon={<ArrowUpRight size={14} />}
            onClick={() => onAction?.("buy")}
            variant="primary"
          />
          <ActionButton
            label="Sell Shares"
            icon={<ArrowDownRight size={14} />}
            onClick={() => onAction?.("sell")}
            variant="secondary"
          />
        </div>
        <button
          onClick={() => onAction?.("withdraw")}
          className="w-full mt-2 flex items-center justify-center gap-2 border border-emerald-300 bg-emerald-50 rounded-[2px] px-3 py-2.5 font-sans text-[12px] font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
        >
          <Sparkles size={13} />
          Withdraw Earnings
        </button>
      </Panel>

      {/* Active Positions Summary */}
      <Panel origin="onchain" title="// Active Holdings">
        {!portfolio?.length ? (
          <div className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 py-4 text-center">
            No positions
          </div>
        ) : (
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {portfolio.slice(0, 5).map((position) => (
              <div
                key={position.assetId}
                className="flex items-center justify-between gap-2 border border-neutral-200 bg-white rounded-[2px] px-2 py-1.5"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-sans text-[11px] text-neutral-900 truncate">
                    {position.title}
                  </div>
                  <div className="font-mono text-[9px] text-neutral-500">
                    {position.shares} shares
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono text-[11px] text-neutral-900">
                    {formatUSD(position.currentValue)}
                  </div>
                  <div className="font-mono text-[9px] text-emerald-600">
                    {position.pctOwned.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

function QuickStat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: "emerald" | "sky" | "amber";
}) {
  const colors = {
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-200",
    sky: "text-sky-600 bg-sky-50 border-sky-200",
    amber: "text-amber-600 bg-amber-50 border-amber-200",
  };

  return (
    <div className={`border rounded-[2px] px-2.5 py-2 ${colors[accent]}`}>
      <div className="flex items-center gap-1 mb-1">
        {icon}
        <span className="font-mono text-[9px] uppercase tracking-widest opacity-80">
          {label}
        </span>
      </div>
      <div className="font-mono text-[16px] font-semibold">{value}</div>
    </div>
  );
}

function ActionButton({
  label,
  icon,
  onClick,
  variant,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant: "primary" | "secondary";
}) {
  const styles =
    variant === "primary"
      ? "bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800"
      : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50";

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center justify-center gap-1.5 border rounded-[2px] px-3 py-2 font-sans text-[11px] font-medium transition-colors ${styles}`}
    >
      {icon}
      {label}
    </motion.button>
  );
}
