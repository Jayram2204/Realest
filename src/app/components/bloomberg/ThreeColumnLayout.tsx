import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PropertyNavigator } from "./PropertyNavigator";
import { FinancialTerminal } from "./FinancialTerminal";
import { PropertyDetails3D } from "./PropertyDetails3D";
import { useProperty } from "../../hooks/useChain";

interface ThreeColumnLayoutProps {
  onPropertySelect?: (assetId: string) => void;
}

export function ThreeColumnLayout({ onPropertySelect }: ThreeColumnLayoutProps) {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const { data: selectedProperty } = useProperty(selectedAssetId ?? "");

  const handlePropertySelect = (assetId: string) => {
    setSelectedAssetId(assetId);
    onPropertySelect?.(assetId);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-neutral-50 dark:bg-terminal-deep transition-colors">
      {/* Column 1: Property Navigator (320px fixed) */}
      <motion.div
        initial={{ x: -320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-[320px] shrink-0 h-full"
      >
        <PropertyNavigator
          onSelect={handlePropertySelect}
          selectedAssetId={selectedAssetId ?? undefined}
        />
      </motion.div>

      {/* Column 2: Property Terminal (flex-1, min 500px) */}
      <div className="flex-1 min-w-[500px] h-full overflow-y-auto bg-white dark:bg-terminal-base transition-colors">
        <AnimatePresence mode="wait">
          {selectedProperty ? (
            <motion.div
              key={selectedProperty.assetId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <PropertyDetails3D property={selectedProperty} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center"
            >
              <div className="text-center">
                <div className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">
                  No property selected
                </div>
                <div className="font-sans text-[13px] text-neutral-600 dark:text-neutral-400">
                  Select a property from the navigator to view details
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Column 3: Financial Dashboard (280px fixed) */}
      <motion.div
        initial={{ x: 280, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
        className="w-[280px] shrink-0 h-full overflow-y-auto border-l border-neutral-300 dark:border-neutral-700 bg-white dark:bg-terminal-base p-4 transition-colors"
      >
        <FinancialTerminal onAction={(action) => console.log("Action:", action)} />
      </motion.div>
    </div>
  );
}
