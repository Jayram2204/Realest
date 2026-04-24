import { Lock } from "lucide-react";
import { cn } from "../../lib/cn";
import { useCapabilities, useIdentity } from "../../hooks/useChain";
import type { AbacCapability } from "../../types/chain";

type Variant = "primary" | "ghost" | "danger";

const VARIANT: Record<Variant, string> = {
  primary: "bg-neutral-900 text-white hover:bg-black border-neutral-900",
  ghost: "bg-white text-neutral-900 hover:bg-neutral-50 border-neutral-300",
  danger: "bg-red-600 text-white hover:bg-red-700 border-red-600",
};

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  capability: AbacCapability;
  variant?: Variant;
}

export function AbacButton({ capability, variant = "primary", className, children, disabled, ...rest }: Props) {
  const identity = useIdentity();
  const caps = useCapabilities(identity.data?.org);
  const allowed = caps.data?.includes(capability) ?? false;
  const locked = !caps.loading && !allowed;

  return (
    <button
      {...rest}
      disabled={disabled || locked}
      title={locked ? `Locked: requires ${capability}` : undefined}
      className={cn(
        "inline-flex items-center gap-2 border rounded-[2px] px-4 py-2 font-sans text-[13px] font-medium tracking-wide transition-colors",
        VARIANT[variant],
        locked && "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed hover:bg-neutral-100",
        className,
      )}
    >
      {locked && <Lock size={12} />}
      {children}
    </button>
  );
}
