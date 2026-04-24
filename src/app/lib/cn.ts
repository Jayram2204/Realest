import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const mono = "font-mono tracking-tight";
export const sans = "font-sans";

export function formatUSD(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function formatHash(h: string, lead = 10, tail = 6): string {
  if (!h) return "—";
  if (h.length <= lead + tail + 3) return h;
  return `${h.slice(0, lead)}…${h.slice(-tail)}`;
}
