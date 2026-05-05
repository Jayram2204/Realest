import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Search, SlidersHorizontal, TrendingUp, Shield } from "lucide-react";
import { useProperties } from "../../hooks/useChain";
import { formatUSD } from "../../lib/cn";
import type { PropertyStatus } from "../../types/chain";

interface PropertyNavigatorProps {
  onSelect: (assetId: string) => void;
  selectedAssetId?: string;
}

const FILTERS: (PropertyStatus | "ALL")[] = ["ALL", "LISTED", "VERIFIED", "PENDING", "SOLD_OUT"];

export function PropertyNavigator({ onSelect, selectedAssetId }: PropertyNavigatorProps) {
  const { data: properties, loading } = useProperties();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<PropertyStatus | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"yield" | "value" | "trust">("value");

  const filteredAndSorted = useMemo(() => {
    let result = properties ?? [];

    // Filter by status
    if (filter !== "ALL") {
      result = result.filter((p) => p.status === filter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.assetId.toLowerCase().includes(query) ||
          p.district.toLowerCase().includes(query)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "yield":
          return b.totalValuation - a.totalValuation; // Mock yield sort
        case "value":
          return b.totalValuation - a.totalValuation;
        case "trust":
          return b.assetId.localeCompare(a.assetId); // Mock trust score sort
        default:
          return 0;
      }
    });

    return result;
  }, [properties, filter, searchQuery, sortBy]);

  const PropertyCard = ({ property }: { property: any }) => {
    const isSelected = property.assetId === selectedAssetId;

    return (
      <div className="px-2 py-1">
        <motion.button
          onClick={() => onSelect(property.assetId)}
          whileHover={{ scale: 1.01, x: 4 }}
          whileTap={{ scale: 0.99 }}
          className={`w-full text-left border rounded-[2px] p-3 transition-all ${
            isSelected
              ? "bg-indigo-50 dark:bg-indigo-950 border-indigo-300 dark:border-indigo-700 shadow-sm"
              : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-sm"
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="font-sans text-[12px] font-medium text-neutral-900 dark:text-neutral-100 truncate">
                {property.title}
              </div>
              <div className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                {property.district}
              </div>
            </div>
            {property.status === "VERIFIED" && (
              <Shield size={12} className="text-emerald-600 shrink-0" />
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="font-mono text-[11px] text-neutral-900 dark:text-neutral-100">
              {formatUSD(property.totalValuation)}
            </div>
            <div className="flex items-center gap-1 text-emerald-600">
              <TrendingUp size={10} />
              <span className="font-mono text-[10px]">
                {(Math.random() * 10 + 2).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-center gap-1">
            <div
              className={`px-1.5 py-0.5 rounded-[2px] font-mono text-[8px] uppercase tracking-widest ${
                property.status === "LISTED"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                  : property.status === "VERIFIED"
                    ? "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400"
                    : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              }`}
            >
              {property.status}
            </div>
            <div className="font-mono text-[9px] text-neutral-400 truncate">
              {property.assetId}
            </div>
          </div>
        </motion.button>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-neutral-50 dark:bg-terminal-base border-r border-neutral-300 dark:border-neutral-700 transition-colors">
      {/* Header */}
      <div className="border-b border-neutral-300 dark:border-neutral-700 bg-white dark:bg-terminal-deep p-3 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-sans font-semibold text-[14px] text-neutral-900 dark:text-neutral-100">
              Properties
            </div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              {filteredAndSorted.length} assets
            </div>
          </div>
          <button
            className="p-1.5 border border-neutral-300 dark:border-neutral-700 rounded-[2px] hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Filter options"
          >
            <SlidersHorizontal size={14} className="text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search properties..."
            className="w-full pl-8 pr-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-[2px] font-sans text-[12px] bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-1 mb-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 border rounded-[2px] px-2 py-1 font-mono text-[9px] uppercase tracking-widest transition-colors ${
                filter === f
                  ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex gap-1">
          {[
            { id: "value", label: "Value" },
            { id: "yield", label: "Yield" },
            { id: "trust", label: "Trust" },
          ].map((sort) => (
            <button
              key={sort.id}
              onClick={() => setSortBy(sort.id as any)}
              className={`flex-1 border rounded-[2px] px-2 py-1 font-mono text-[9px] uppercase tracking-widest transition-colors ${
                sortBy === sort.id
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
            >
              {sort.label}
            </button>
          ))}
        </div>
      </div>

      {/* Property List (Scrollable) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              Loading...
            </div>
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center px-4">
              <div className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1">
                No properties found
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="font-sans text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="pb-4">
            {filteredAndSorted.map((property) => (
              <PropertyCard key={property.assetId} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
