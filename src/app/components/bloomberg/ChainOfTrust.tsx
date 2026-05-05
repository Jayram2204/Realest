import { useState } from "react";
import { motion } from "motion/react";
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  TrendingUp,
  FileCheck,
  Users,
  Award,
} from "lucide-react";
import { Panel } from "../ui/Panel";

interface TrustMetric {
  category: string;
  score: number;
  weight: number;
  status: "excellent" | "good" | "fair" | "poor";
}

interface HistoricalOwner {
  address: string;
  name?: string;
  period: string;
  verified: boolean;
}

interface ChainOfTrustProps {
  address: string;
  assetId?: string;
  className?: string;
}

export function ChainOfTrust({
  address,
  assetId,
  className,
}: ChainOfTrustProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Mock trust score calculation
  const trustMetrics: TrustMetric[] = [
    {
      category: "On-Chain History",
      score: 92,
      weight: 0.4,
      status: "excellent",
    },
    {
      category: "Identity Verification",
      score: 95,
      weight: 0.3,
      status: "excellent",
    },
    {
      category: "Dispute Resolution",
      score: 78,
      weight: 0.2,
      status: "good",
    },
    {
      category: "Community Reputation",
      score: 85,
      weight: 0.1,
      status: "excellent",
    },
  ];

  const totalScore = trustMetrics.reduce(
    (sum, m) => sum + m.score * m.weight,
    0
  );

  const historicalOwners: HistoricalOwner[] = [
    {
      address: "0x1a2b...3c4d",
      name: "Greenfield Properties LLC",
      period: "2020 - 2022",
      verified: true,
    },
    {
      address: "0x5e6f...7g8h",
      name: "Urban Development Corp",
      period: "2022 - 2024",
      verified: true,
    },
    {
      address: address,
      name: "Current Owner",
      period: "2024 - Present",
      verified: true,
    },
  ];

  const trustLevel =
    totalScore >= 85
      ? { label: "Excellent", color: "emerald" }
      : totalScore >= 70
        ? { label: "Good", color: "sky" }
        : totalScore >= 50
          ? { label: "Fair", color: "amber" }
          : { label: "Poor", color: "red" };

  return (
    <Panel
      origin="onchain"
      title="// Chain of Trust"
      subtitle={`Trust score verification · ${address.slice(0, 10)}...`}
      className={className}
    >
      <div className="space-y-4">
        {/* Overall Trust Score */}
        <div className="border border-neutral-300 rounded-[2px] p-4 bg-gradient-to-br from-white to-neutral-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield size={20} className={`text-${trustLevel.color}-600`} />
              <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">
                Trust Score
              </span>
            </div>
            <span
              className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-[2px] bg-${trustLevel.color}-50 text-${trustLevel.color}-700 border border-${trustLevel.color}-200`}
            >
              {trustLevel.label}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-mono text-[36px] font-bold text-neutral-900">
              {Math.round(totalScore)}
            </span>
            <span className="font-mono text-[16px] text-neutral-500">/100</span>
          </div>

          {/* Trust Score Bar */}
          <div className="relative h-2 bg-neutral-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${totalScore}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`absolute inset-y-0 left-0 bg-${trustLevel.color}-600 rounded-full`}
            />
          </div>
        </div>

        {/* Trust Metrics Breakdown */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-left border border-neutral-200 rounded-[2px] p-3 hover:bg-neutral-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-[12px] font-medium text-neutral-900">
              View detailed breakdown
            </span>
            <span className="font-mono text-[10px] text-indigo-600">
              {showDetails ? "Hide" : "Show"} →
            </span>
          </div>
        </button>

        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {trustMetrics.map((metric) => (
              <TrustMetricCard key={metric.category} metric={metric} />
            ))}
          </motion.div>
        )}

        {/* Verification Badges */}
        <div className="grid grid-cols-2 gap-2">
          <VerificationBadge
            icon={<FileCheck size={14} />}
            label="KYC Level 2"
            status="verified"
          />
          <VerificationBadge
            icon={<Award size={14} />}
            label="47 Transactions"
            status="verified"
          />
          <VerificationBadge
            icon={<Users size={14} />}
            label="1 Dispute Resolved"
            status="warning"
          />
          <VerificationBadge
            icon={<TrendingUp size={14} />}
            label="4.8★ Rating"
            status="verified"
          />
        </div>

        {/* Historical Ownership Timeline */}
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-neutral-500 mb-3">
            Ownership History
          </div>
          <div className="space-y-3">
            {historicalOwners.map((owner, idx) => (
              <OwnershipRecord
                key={owner.address}
                owner={owner}
                isLast={idx === historicalOwners.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Full History Link */}
        <button className="w-full flex items-center justify-center gap-1.5 border border-neutral-300 rounded-[2px] px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-indigo-600 hover:bg-neutral-50 transition-colors">
          <span>View Full Chain History</span>
          <ExternalLink size={10} />
        </button>
      </div>
    </Panel>
  );
}

function TrustMetricCard({ metric }: { metric: TrustMetric }) {
  const statusColors = {
    excellent: "text-emerald-600 bg-emerald-50 border-emerald-200",
    good: "text-sky-600 bg-sky-50 border-sky-200",
    fair: "text-amber-600 bg-amber-50 border-amber-200",
    poor: "text-red-600 bg-red-50 border-red-200",
  };

  return (
    <div className="border border-neutral-200 rounded-[2px] p-3 bg-white">
      <div className="flex items-center justify-between mb-2">
        <span className="font-sans text-[12px] text-neutral-900">
          {metric.category}
        </span>
        <span className="font-mono text-[11px] font-semibold text-neutral-900">
          {metric.score}/100
        </span>
      </div>
      <div className="relative h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${metric.score}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`absolute inset-y-0 left-0 rounded-full ${statusColors[metric.status].split(" ")[1]}`}
        />
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">
          Weight: {(metric.weight * 100).toFixed(0)}%
        </span>
        <span
          className={`font-mono text-[9px] uppercase tracking-widest ${statusColors[metric.status].split(" ")[0]}`}
        >
          {metric.status}
        </span>
      </div>
    </div>
  );
}

function VerificationBadge({
  icon,
  label,
  status,
}: {
  icon: React.ReactNode;
  label: string;
  status: "verified" | "warning" | "unverified";
}) {
  const styles = {
    verified: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    unverified: "border-neutral-200 bg-neutral-50 text-neutral-500",
  };

  return (
    <div
      className={`flex items-center gap-2 border rounded-[2px] px-2.5 py-2 ${styles[status]}`}
    >
      {status === "verified" && <CheckCircle2 size={13} className="shrink-0" />}
      {status === "warning" && <AlertTriangle size={13} className="shrink-0" />}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="font-mono text-[10px] font-medium truncate">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

function OwnershipRecord({
  owner,
  isLast,
}: {
  owner: HistoricalOwner;
  isLast: boolean;
}) {
  return (
    <div className="relative pl-6">
      {/* Timeline dot */}
      <div
        className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 ${
          owner.verified
            ? "bg-emerald-600 border-emerald-600"
            : "bg-neutral-300 border-neutral-300"
        }`}
      />
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[5px] top-5 bottom-0 w-0.5 bg-neutral-200" />
      )}

      <div className="border border-neutral-200 bg-white rounded-[2px] p-2.5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="font-sans text-[12px] text-neutral-900 font-medium">
            {owner.name || "Unknown Owner"}
          </div>
          {owner.verified && (
            <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
          )}
        </div>
        <div className="font-mono text-[10px] text-neutral-500">
          {owner.address}
        </div>
        <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 mt-1">
          {owner.period}
        </div>
      </div>
    </div>
  );
}
