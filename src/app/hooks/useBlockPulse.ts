import { useEffect, useState } from "react";

export function useBlockPulse(intervalMs = 3000) {
  const [block, setBlock] = useState(184203);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setBlock((b) => b + 1);
      setPulse((p) => (p + 1) % 1000);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--pulse-phase", String((pulse % 2) * 0.5 + 0.5));
    root.style.setProperty("--pulse-block", String(block));
  }, [block, pulse]);

  return { block, pulse };
}
