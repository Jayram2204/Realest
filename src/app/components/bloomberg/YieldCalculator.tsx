import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { TrendingUp, Calculator, Info } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Panel } from "../ui/Panel";
import { usePortfolio } from "../../hooks/useChain";
import { formatUSD } from "../../lib/cn";

interface YieldCalculatorProps {
  assetId?: string;
  className?: string;
}

export function YieldCalculator({ assetId, className }: YieldCalculatorProps) {
  const { data: portfolio } = usePortfolio();
  const [projectionMonths, setProjectionMonths] = useState(12);

  const analysis = useMemo(() => {
    // If assetId provided, analyze single asset; otherwise portfolio
    const positions = assetId
      ? portfolio?.filter((p) => p.assetId === assetId) ?? []
      : portfolio ?? [];

    const totalValue = positions.reduce((sum, p) => sum + p.currentValue, 0);
    const totalShares = positions.reduce((sum, p) => sum + p.shares, 0);

    // Mock yield metrics (in real app, fetch from smart contract)
    const annualDividendPerShare = 0.0823 * 12; // $0.0823/month
    const annualYield = totalValue > 0 ? (annualDividendPerShare * totalShares) / totalValue : 0;
    const apy = annualYield * 100;
    const apr = apy / (1 + apy / 12); // Simplified APR calculation

    // Generate projection data
    const projectionData = Array.from({ length: projectionMonths + 1 }, (_, month) => {
      const conservativeYield = totalValue * (1 + apr * 0.8 * (month / 12));
      const expectedYield = totalValue * (1 + apr * (month / 12));
      const optimisticYield = totalValue * (1 + apr * 1.2 * (month / 12));

      return {
        month,
        conservative: conservativeYield,
        expected: expectedYield,
        optimistic: optimisticYield,
      };
    });

    const projectedEarnings = {
      conservative: annualDividendPerShare * totalShares * 0.8 * (projectionMonths / 12),
      expected: annualDividendPerShare * totalShares * (projectionMonths / 12),
      optimistic: annualDividendPerShare * totalShares * 1.2 * (projectionMonths / 12),
    };

    return {
      totalValue,
      totalShares,
      apy,
      apr: apr * 100,
      annualDividend: annualDividendPerShare * totalShares,
      monthlyDividend: (annualDividendPerShare * totalShares) / 12,
      projectionData,
      projectedEarnings,
    };
  }, [portfolio, assetId, projectionMonths]);

  return (
    <Panel
      origin="onchain"
      title="// Yield Calculator"
      subtitle="APY projection & earnings forecast"
      className={className}
    >
      <div className="space-y-4">
        {/* Yield Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <YieldMetric label="APY" value={`${analysis.apy.toFixed(2)}%`} accent="emerald" />
          <YieldMetric label="APR" value={`${analysis.apr.toFixed(2)}%`} accent="sky" />
          <YieldMetric
            label="Monthly"
            value={formatUSD(analysis.monthlyDividend)}
            accent="amber"
          />
        </div>

        {/* Projection Controls */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calculator size={13} className="text-neutral-500" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
              Projection Period
            </span>
          </div>
          <div className="flex items-center gap-2">
            {[6, 12, 24, 36].map((months) => (
              <button
                key={months}
                onClick={() => setProjectionMonths(months)}
                className={`border rounded-[2px] px-2 py-1 font-mono text-[10px] transition-colors ${
                  projectionMonths === months
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                {months}m
              </button>
            ))}
          </div>
        </div>

        {/* Projection Chart */}
        <div className="h-[160px] -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart key="yield-projection-chart" data={analysis.projectionData}>
              <XAxis
                key="yield-x-axis"
                dataKey="month"
                tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }}
                tickFormatter={(v) => `${v}m`}
              />
              <YAxis
                key="yield-y-axis"
                hide
                domain={["dataMin - 1000", "dataMax + 1000"]}
              />
              <Tooltip
                key="yield-tooltip"
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-neutral-900 text-white px-3 py-2 rounded-[2px] space-y-1">
                      <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">
                        Month {payload[0]?.payload.month}
                      </div>
                      {payload.map((entry, idx) => (
                        <div key={`tooltip-${entry.name}-${idx}`} className="font-mono text-[10px] flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="capitalize">{entry.name}:</span>
                          <span className="font-semibold">{formatUSD(entry.value as number)}</span>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
              <Line
                key="line-conservative"
                type="monotone"
                dataKey="conservative"
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
                name="conservative"
              />
              <Line
                key="line-expected"
                type="monotone"
                dataKey="expected"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={false}
                name="expected"
              />
              <Line
                key="line-optimistic"
                type="monotone"
                dataKey="optimistic"
                stroke="#3b82f6"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
                name="optimistic"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Projected Earnings */}
        <div className="border border-neutral-200 rounded-[2px] p-3 bg-neutral-50">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp size={12} className="text-neutral-600" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-600">
              Projected Earnings ({projectionMonths} months)
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
            <div>
              <div className="text-neutral-500 text-[9px] uppercase tracking-widest mb-0.5">
                Conservative
              </div>
              <div className="text-neutral-900 font-semibold">
                {formatUSD(analysis.projectedEarnings.conservative)}
              </div>
            </div>
            <div>
              <div className="text-emerald-600 text-[9px] uppercase tracking-widest mb-0.5">
                Expected
              </div>
              <div className="text-emerald-700 font-semibold">
                {formatUSD(analysis.projectedEarnings.expected)}
              </div>
            </div>
            <div>
              <div className="text-sky-600 text-[9px] uppercase tracking-widest mb-0.5">
                Optimistic
              </div>
              <div className="text-sky-700 font-semibold">
                {formatUSD(analysis.projectedEarnings.optimistic)}
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 text-neutral-500">
          <Info size={12} className="shrink-0 mt-0.5" />
          <p className="font-sans text-[10px] leading-relaxed">
            Projections based on historical performance. Actual yields may vary. Not financial advice.
          </p>
        </div>
      </div>
    </Panel>
  );
}

function YieldMetric({
  label,
  value,
  accent,
}: {
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
      <div className="font-mono text-[9px] uppercase tracking-widest opacity-80 mb-1">
        {label}
      </div>
      <div className="font-mono text-[16px] font-semibold">{value}</div>
    </div>
  );
}
