import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DollarSign, TrendingUp, CheckCircle2, Loader2, ExternalLink } from "lucide-react";
import confetti from "canvas-confetti";
import { Panel } from "../ui/Panel";
import { usePortfolio } from "../../hooks/useChain";
import { formatUSD } from "../../lib/cn";

interface ClaimableEarningsProps {
  className?: string;
}

type TransactionState = "idle" | "pending" | "confirming" | "success" | "error";

export function ClaimableEarnings({ className }: ClaimableEarningsProps) {
  const { data: portfolio } = usePortfolio();
  const [txState, setTxState] = useState<TransactionState>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);

  // Calculate earnings using O(1) cumulative dividend algorithm
  const earnings = calculateEarnings(portfolio ?? []);

  const handleWithdraw = async () => {
    if (earnings.totalAccrued === 0) return;

    // Simulate blockchain transaction
    setTxState("pending");

    // Step 1: User signs transaction (1-2s)
    await sleep(1500);
    setTxState("confirming");

    // Step 2: Transaction submitted and confirming (2-3s)
    const mockTxHash = generateMockTxHash();
    setTxHash(mockTxHash);
    await sleep(2500);

    // Step 3: Success!
    setTxState("success");

    // Trigger confetti for withdrawals over $100
    if (earnings.totalAccrued > 100) {
      triggerConfetti();
    }

    // Reset after 5s
    setTimeout(() => {
      setTxState("idle");
      setTxHash(null);
    }, 5000);
  };

  return (
    <Panel
      origin="onchain"
      title="// Claimable Earnings"
      subtitle="getCumulativeDividend(address)"
      className={className}
    >
      <div className="space-y-4">
        {/* Earnings Summary */}
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            label="Total Accrued"
            value={formatUSD(earnings.totalAccrued)}
            icon={<DollarSign size={14} />}
            accent="emerald"
          />
          <MetricCard
            label="Avg Yield"
            value={`${earnings.avgYield.toFixed(2)}%`}
            icon={<TrendingUp size={14} />}
            accent="sky"
          />
        </div>

        {/* Breakdown */}
        <div className="space-y-2 font-mono text-[11px]">
          <div className="flex justify-between items-center">
            <span className="text-neutral-500 uppercase tracking-widest">Your Shares</span>
            <span className="text-neutral-900">{earnings.totalShares.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500 uppercase tracking-widest">Positions</span>
            <span className="text-neutral-900">{earnings.positions}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500 uppercase tracking-widest">Dividend Rate</span>
            <span className="text-neutral-900">${earnings.dividendPerShare.toFixed(4)}/share</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
            <span className="text-neutral-500 uppercase tracking-widest">Debt Adjustment</span>
            <span className="text-neutral-900">-${earnings.debtAdjustment.toFixed(2)}</span>
          </div>
        </div>

        {/* Withdraw Button */}
        <AnimatePresence mode="wait">
          {txState === "idle" && (
            <motion.button
              key="withdraw"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={handleWithdraw}
              disabled={earnings.totalAccrued === 0}
              className={`w-full border rounded-[2px] px-4 py-3 font-sans text-[13px] font-medium transition-all ${
                earnings.totalAccrued === 0
                  ? "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed"
                  : "bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              Withdraw {formatUSD(earnings.totalAccrued)}
            </motion.button>
          )}

          {txState === "pending" && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center gap-2 border border-indigo-300 bg-indigo-50 rounded-[2px] px-4 py-3"
            >
              <Loader2 size={16} className="animate-spin text-indigo-600" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-indigo-700">
                Awaiting signature...
              </span>
            </motion.div>
          )}

          {txState === "confirming" && (
            <motion.div
              key="confirming"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-center gap-2 border border-amber-300 bg-amber-50 rounded-[2px] px-4 py-3">
                <Loader2 size={16} className="animate-spin text-amber-600" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-amber-700">
                  Confirming on-chain...
                </span>
              </div>
              {txHash && (
                <a
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 font-mono text-[10px] text-indigo-600 hover:underline"
                >
                  <span>{txHash.slice(0, 8)}...{txHash.slice(-6)}</span>
                  <ExternalLink size={10} />
                </a>
              )}
            </motion.div>
          )}

          {txState === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-center gap-2 border border-emerald-300 bg-emerald-50 rounded-[2px] px-4 py-3"
            >
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-700">
                Withdrawal successful!
              </span>
            </motion.div>
          )}

          {txState === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <div className="border border-red-300 bg-red-50 rounded-[2px] px-4 py-3">
                <div className="font-mono text-[11px] uppercase tracking-widest text-red-700">
                  Transaction failed
                </div>
                <div className="font-sans text-[11px] text-red-600 mt-1">
                  Insufficient gas. Please try again.
                </div>
              </div>
              <button
                onClick={handleWithdraw}
                className="w-full border border-neutral-300 rounded-[2px] px-4 py-2 font-sans text-[12px] hover:bg-neutral-50"
              >
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Details Link */}
        {txState === "idle" && (
          <button className="w-full font-mono text-[10px] uppercase tracking-widest text-indigo-600 hover:underline">
            View Transaction History →
          </button>
        )}
      </div>
    </Panel>
  );
}

function MetricCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: "emerald" | "sky";
}) {
  const colors = {
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-200",
    sky: "text-sky-600 bg-sky-50 border-sky-200",
  };

  return (
    <div className={`border rounded-[2px] px-3 py-2.5 ${colors[accent]}`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
        <span className="font-mono text-[9px] uppercase tracking-widest opacity-80">
          {label}
        </span>
      </div>
      <div className="font-mono text-[18px] font-semibold">{value}</div>
    </div>
  );
}

// O(1) Cumulative Dividend Calculation
function calculateEarnings(portfolio: any[]) {
  const cumulativeDividendPerShare = 0.0823; // Mock: $0.0823 per share
  const debtAdjustment = 0; // No prior withdrawals

  const totalShares = portfolio.reduce((sum, p) => sum + p.shares, 0);
  const totalAccrued = totalShares * cumulativeDividendPerShare - debtAdjustment;
  const totalValue = portfolio.reduce((sum, p) => sum + p.currentValue, 0);
  const avgYield = totalValue > 0 ? (totalAccrued / totalValue) * 100 : 0;

  return {
    totalAccrued,
    totalShares,
    positions: portfolio.length,
    dividendPerShare: cumulativeDividendPerShare,
    debtAdjustment,
    avgYield,
  };
}

function triggerConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: any) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

function generateMockTxHash(): string {
  return "0x" + Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
