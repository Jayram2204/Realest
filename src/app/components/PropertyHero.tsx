import { cn } from "../lib/cn";
import { StatusBadge } from "./ui/StatusBadge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { Property } from "../types/chain";

export function PropertyHero({ property }: { property: Property }) {
  const [hero, ...rest] = property.images;

  return (
    <div className="relative border border-neutral-300 rounded-[2px] bg-white overflow-hidden">
      <div className="absolute top-3 left-3 z-10">
        <StatusBadge status={property.status} />
      </div>

      <div className="grid grid-cols-3 grid-rows-2 gap-px bg-neutral-300 h-[420px]">
        <div className="col-span-2 row-span-2 bg-white relative overflow-hidden">
          {hero ? (
            <ImageWithFallback src={hero.url} alt={hero.alt} className="w-full h-full object-cover" />
          ) : (
            <Placeholder label="NO MEDIA" />
          )}
          {hero && (
            <div className="absolute bottom-3 left-3 bg-white/95 border border-neutral-300 px-2 py-1 rounded-[2px]">
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-700">
                {hero.id}
              </span>
            </div>
          )}
        </div>
        {[0, 1].map((i) => {
          const img = rest[i];
          return (
            <div key={i} className="bg-white relative overflow-hidden">
              {img ? (
                <ImageWithFallback src={img.url} alt={img.alt} className="w-full h-full object-cover" />
              ) : (
                <Placeholder label="—" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className={cn("w-full h-full flex items-center justify-center bg-neutral-50", "font-mono text-[10px] uppercase tracking-widest text-neutral-400")}>
      {label}
    </div>
  );
}
