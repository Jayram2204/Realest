import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Lock,
  FileCheck,
  Key,
  Coins,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Users,
} from "lucide-react";
import { Panel } from "../ui/Panel";

type LifecycleStage = "deposit" | "terms" | "keys" | "funds";
type StageStatus = "completed" | "in_progress" | "pending" | "error";

interface StageData {
  stage: LifecycleStage;
  status: StageStatus;
  label: string;
  description: string;
  timestamp?: string;
  txHash?: string;
  metadata?: any;
}

interface TransactionLifecycleProps {
  transactionId: string;
  className?: string;
}

export function TransactionLifecycle({
  transactionId,
  className,
}: TransactionLifecycleProps) {
  // Simulate real-time updates via WebSocket
  const [stages, setStages] = useState<StageData[]>([
    {
      stage: "deposit",
      status: "completed",
      label: "Deposit Locked",
      description: "Funds secured in escrow",
      timestamp: "2026-05-05 09:23:14 UTC",
      txHash: "0x7b5e...9c3a",
      metadata: { amount: "$125,000.00" },
    },
    {
      stage: "terms",
      status: "in_progress",
      label: "Terms Verified",
      description: "Multi-signature approval process",
      metadata: { approved: 2, required: 3 },
    },
    {
      stage: "keys",
      status: "pending",
      label: "Keys Released",
      description: "Digital property access transfer",
    },
    {
      stage: "funds",
      status: "pending",
      label: "Funds Distributed",
      description: "Final settlement to all parties",
    },
  ]);

  // Simulate WebSocket updates
  useEffect(() => {
    const timeout = setTimeout(() => {
      setStages((prev) =>
        prev.map((s) =>
          s.stage === "terms"
            ? {
                ...s,
                status: "completed",
                timestamp: "2026-05-05 10:15:42 UTC",
                txHash: "0x3f2a...7e1b",
                metadata: { approved: 3, required: 3 },
              }
            : s.stage === "keys"
              ? { ...s, status: "in_progress" }
              : s
        )
      );
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  const currentStage = stages.find((s) => s.status === "in_progress");

  return (
    <Panel
      origin="onchain"
      title="// Transaction Lifecycle"
      subtitle={`Escrow ID: ${transactionId}`}
      className={className}
      action={
        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
          Real-time sync
        </span>
      }
    >
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="relative">
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-neutral-200" />
          <div className="relative flex items-start justify-between">
            {stages.map((stage, idx) => (
              <StageIndicator
                key={stage.stage}
                stage={stage}
                isLast={idx === stages.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Current Stage Details */}
        <AnimatePresence mode="wait">
          {currentStage && (
            <motion.div
              key={currentStage.stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border border-indigo-300 bg-indigo-50 rounded-[2px] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={14} className="text-indigo-600" />
                    <span className="font-mono text-[11px] uppercase tracking-widest text-indigo-700">
                      In Progress
                    </span>
                  </div>
                  <div className="font-sans text-[14px] font-semibold text-neutral-900 mb-1">
                    {currentStage.label}
                  </div>
                  <div className="font-sans text-[12px] text-neutral-600">
                    {currentStage.description}
                  </div>
                  {currentStage.stage === "terms" && currentStage.metadata && (
                    <div className="mt-3 flex items-center gap-2">
                      <Users size={14} className="text-neutral-500" />
                      <span className="font-mono text-[11px] text-neutral-700">
                        {currentStage.metadata.approved}/{currentStage.metadata.required} signatures
                        collected
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage Details */}
        <div className="space-y-3">
          {stages.map((stage) => (
            <StageDetail key={stage.stage} stage={stage} />
          ))}
        </div>
      </div>
    </Panel>
  );
}

function StageIndicator({
  stage,
  isLast,
}: {
  stage: StageData;
  isLast: boolean;
}) {
  const icons = {
    deposit: <Lock size={14} />,
    terms: <FileCheck size={14} />,
    keys: <Key size={14} />,
    funds: <Coins size={14} />,
  };

  const statusStyles = {
    completed: "bg-emerald-600 border-emerald-600 text-white",
    in_progress: "bg-indigo-600 border-indigo-600 text-white animate-pulse",
    pending: "bg-white border-neutral-300 text-neutral-400",
    error: "bg-red-600 border-red-600 text-white",
  };

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        initial={false}
        animate={{
          scale: stage.status === "in_progress" ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: stage.status === "in_progress" ? Infinity : 0,
        }}
        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 ${statusStyles[stage.status]}`}
      >
        {stage.status === "completed" ? (
          <CheckCircle2 size={16} />
        ) : stage.status === "error" ? (
          <AlertCircle size={16} />
        ) : (
          icons[stage.stage]
        )}
      </motion.div>
      {!isLast && (
        <div
          className={`absolute top-5 left-[50%] w-full h-0.5 ${
            stage.status === "completed" ? "bg-emerald-600" : "bg-neutral-200"
          }`}
        />
      )}
    </div>
  );
}

function StageDetail({ stage }: { stage: StageData }) {
  const [expanded, setExpanded] = useState(false);

  if (stage.status === "pending") return null;

  const statusColors = {
    completed: "border-emerald-200 bg-emerald-50",
    in_progress: "border-indigo-200 bg-indigo-50",
    error: "border-red-200 bg-red-50",
    pending: "",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`border rounded-[2px] p-3 ${statusColors[stage.status]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {stage.status === "completed" && (
              <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
            )}
            {stage.status === "in_progress" && (
              <Clock size={13} className="text-indigo-600 shrink-0" />
            )}
            {stage.status === "error" && (
              <AlertCircle size={13} className="text-red-600 shrink-0" />
            )}
            <span className="font-sans text-[12px] font-semibold text-neutral-900">
              {stage.label}
            </span>
          </div>
          {stage.timestamp && (
            <div className="font-mono text-[10px] text-neutral-500 mb-1">
              {stage.timestamp}
            </div>
          )}
          {stage.metadata?.amount && (
            <div className="font-mono text-[11px] text-neutral-700">
              Amount: {stage.metadata.amount}
            </div>
          )}
          {stage.txHash && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 font-mono text-[10px] text-indigo-600 hover:underline mt-1"
            >
              <span>TX: {stage.txHash}</span>
              <ExternalLink size={10} />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && stage.txHash && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 pt-3 border-t border-neutral-200"
          >
            <div className="space-y-1.5 font-mono text-[10px]">
              <div className="flex justify-between">
                <span className="text-neutral-500">Block Height:</span>
                <span className="text-neutral-900">#1,234,567</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Gas Used:</span>
                <span className="text-neutral-900">21,000 units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Confirmations:</span>
                <span className="text-emerald-600">24</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
