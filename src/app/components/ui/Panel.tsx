import { cn } from "../../lib/cn";

type Origin = "onchain" | "offchain" | "neutral";

const ORIGIN: Record<Origin, string> = {
  onchain: "bg-indigo-50/40 border-neutral-300",
  offchain: "bg-white border-neutral-300",
  neutral: "bg-neutral-50 border-neutral-300",
};

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  origin?: Origin;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Panel({ origin = "offchain", title, subtitle, action, className, children, ...rest }: PanelProps) {
  return (
    <section
      {...rest}
      className={cn("border rounded-[2px]", ORIGIN[origin], className)}
    >
      {(title || action) && (
        <header className="flex items-center justify-between border-b border-neutral-300 px-4 py-2.5">
          <div className="min-w-0">
            {title && <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-600">{title}</div>}
            {subtitle && <div className="font-mono text-[10px] text-neutral-400 mt-0.5 truncate">{subtitle}</div>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}
