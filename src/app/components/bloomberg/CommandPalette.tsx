import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  Building2,
  Clock,
  TrendingUp,
  DollarSign,
  Search,
  ArrowRight,
} from "lucide-react";
import { useProperties, usePortfolio } from "../../hooks/useChain";
import { formatUSD } from "../../lib/cn";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (assetId: string) => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  onNavigate,
}: CommandPaletteProps) {
  const { data: properties } = useProperties();
  const { data: portfolio } = usePortfolio();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Keyboard shortcut Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const handleSelect = (assetId: string) => {
    // Add to recent searches
    setRecentSearches((prev) => {
      const filtered = prev.filter((id) => id !== assetId);
      return [assetId, ...filtered].slice(0, 5);
    });
    onNavigate(assetId);
    onOpenChange(false);
  };

  const myProperties = properties?.filter((p) =>
    portfolio?.some((pp) => pp.assetId === p.assetId)
  );

  const listedProperties = properties?.filter((p) => p.status === "LISTED");

  const recentProperties = recentSearches
    .map((id) => properties?.find((p) => p.assetId === id))
    .filter(Boolean);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command className="rounded-[2px] border border-neutral-300">
        <div className="flex items-center border-b border-neutral-300 px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 text-neutral-500" />
          <CommandInput
            placeholder="Search properties, assets, transactions..."
            className="font-sans text-[13px] border-0 focus:ring-0"
          />
        </div>
        <CommandList className="max-h-[400px] p-2">
          <CommandEmpty>
            <div className="py-6 text-center">
              <div className="font-mono text-[11px] uppercase tracking-widest text-neutral-400">
                No results found
              </div>
            </div>
          </CommandEmpty>

          {/* Recent Searches */}
          {recentProperties.length > 0 && (
            <CommandGroup
              heading={
                <div className="flex items-center gap-1.5 text-neutral-500">
                  <Clock size={11} />
                  <span className="font-mono text-[10px] uppercase tracking-widest">
                    Recent
                  </span>
                </div>
              }
            >
              {recentProperties.map((property) => (
                <CommandItem
                  key={property.assetId}
                  value={property.assetId}
                  onSelect={() => handleSelect(property.assetId)}
                  className="rounded-[2px] px-3 py-2"
                >
                  <PropertySearchResult property={property} />
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* My Portfolio */}
          {myProperties && myProperties.length > 0 && (
            <CommandGroup
              heading={
                <div className="flex items-center gap-1.5 text-neutral-500">
                  <TrendingUp size={11} />
                  <span className="font-mono text-[10px] uppercase tracking-widest">
                    My Portfolio
                  </span>
                </div>
              }
            >
              {myProperties.map((property) => {
                const position = portfolio?.find(
                  (p) => p.assetId === property.assetId
                );
                return (
                  <CommandItem
                    key={property.assetId}
                    value={`${property.title} ${property.assetId} ${property.district}`}
                    onSelect={() => handleSelect(property.assetId)}
                    className="rounded-[2px] px-3 py-2"
                  >
                    <PropertySearchResult
                      property={property}
                      shares={position?.shares}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {/* Active Listings */}
          {listedProperties && listedProperties.length > 0 && (
            <CommandGroup
              heading={
                <div className="flex items-center gap-1.5 text-neutral-500">
                  <Building2 size={11} />
                  <span className="font-mono text-[10px] uppercase tracking-widest">
                    Active Listings
                  </span>
                </div>
              }
            >
              {listedProperties.slice(0, 8).map((property) => (
                <CommandItem
                  key={property.assetId}
                  value={`${property.title} ${property.assetId} ${property.district}`}
                  onSelect={() => handleSelect(property.assetId)}
                  className="rounded-[2px] px-3 py-2"
                >
                  <PropertySearchResult property={property} />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>

        {/* Footer hint */}
        <div className="border-t border-neutral-300 px-3 py-2 bg-neutral-50">
          <div className="flex items-center gap-3 font-mono text-[9px] text-neutral-500">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-neutral-300 rounded">
                ↑↓
              </kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-neutral-300 rounded">
                ↵
              </kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-neutral-300 rounded">
                ESC
              </kbd>
              Close
            </span>
          </div>
        </div>
      </Command>
    </CommandDialog>
  );
}

function PropertySearchResult({
  property,
  shares,
}: {
  property: any;
  shares?: number;
}) {
  return (
    <div className="flex items-center justify-between w-full gap-3">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Building2 size={14} className="text-neutral-400 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="font-sans text-[12px] text-neutral-900 truncate">
            {property.title}
          </div>
          <div className="font-mono text-[10px] text-neutral-500">
            {property.district} · {property.assetId}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {shares !== undefined && (
          <div className="flex items-center gap-1 text-emerald-600">
            <DollarSign size={11} />
            <span className="font-mono text-[11px]">{shares} shares</span>
          </div>
        )}
        <div className="font-mono text-[11px] text-neutral-500">
          {formatUSD(property.totalValuation)}
        </div>
        <ArrowRight size={12} className="text-neutral-400" />
      </div>
    </div>
  );
}
