import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { cn, formatHash } from "../../lib/cn";

interface Props {
  value: string;
  label?: string;
  truncate?: boolean;
  className?: string;
  link?: boolean;
}

export function HashChip({ value, label, truncate = true, className, link }: Props) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* noop */
    }
  };

  return (
    <span className={cn("inline-flex items-center gap-2 min-w-0", className)}>
      {label && (
        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 shrink-0">
          {label}
        </span>
      )}
      <span
        className={cn(
          "font-mono text-[11px] text-indigo-600 truncate",
          link && "hover:underline cursor-pointer",
        )}
        title={value}
      >
        {truncate ? formatHash(value) : value}
      </span>
      <button
        type="button"
        onClick={onCopy}
        className="shrink-0 p-1 border border-transparent hover:border-neutral-300 hover:bg-neutral-50"
        aria-label="Copy"
      >
        {copied ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} className="text-neutral-500" />}
      </button>
      {link && (
        <button type="button" className="shrink-0 p-1 border border-transparent hover:border-neutral-300 hover:bg-neutral-50">
          <ExternalLink size={11} className="text-neutral-500" />
        </button>
      )}
    </span>
  );
}
