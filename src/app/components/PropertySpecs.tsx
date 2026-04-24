import { Bed, Bath, Square, Hash } from "lucide-react";
import type { Property } from "../types/chain";

export function PropertySpecs({ property }: { property: Property }) {
  const items = [
    { icon: Bed, label: "Bedrooms", value: property.bedrooms.toString() },
    { icon: Bath, label: "Bathrooms", value: property.bathrooms.toString() },
    { icon: Square, label: "Sq. Ft.", value: property.sqft.toLocaleString() },
    { icon: Hash, label: "Asset ID", value: property.assetId },
  ];

  return (
    <div className="grid grid-cols-4 border border-neutral-300 rounded-[2px] bg-white">
      {items.map((s, i) => (
        <div key={s.label} className={i < items.length - 1 ? "border-r border-neutral-300" : ""}>
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <s.icon size={12} className="text-neutral-400" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">{s.label}</span>
            </div>
            <div className="font-mono text-[18px] text-neutral-900 truncate">{s.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
