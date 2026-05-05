import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight } from "lucide-react";
import { useEscapeKey } from "../../hooks/useKeyboardShortcut";

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface InspectorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  children: React.ReactNode;
  width?: number;
}

export function InspectorPanel({
  isOpen,
  onClose,
  title,
  subtitle,
  breadcrumbs = [],
  children,
  width = 480,
}: InspectorPanelProps) {
  // Close on ESC key
  useEscapeKey(onClose, isOpen);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: width }}
            animate={{ x: 0 }}
            exit={{ x: width }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ width }}
            className="fixed top-0 right-0 h-screen bg-white border-l border-neutral-300 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="border-b border-neutral-300 p-4 shrink-0">
              {/* Breadcrumbs */}
              {breadcrumbs.length > 0 && (
                <div className="flex items-center gap-1.5 mb-2">
                  {breadcrumbs.map((crumb, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      {crumb.onClick ? (
                        <button
                          onClick={crumb.onClick}
                          className="font-mono text-[10px] uppercase tracking-widest text-indigo-600 hover:underline"
                        >
                          {crumb.label}
                        </button>
                      ) : (
                        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                          {crumb.label}
                        </span>
                      )}
                      {idx < breadcrumbs.length - 1 && (
                        <ChevronRight size={10} className="text-neutral-400" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Title & Close */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="font-sans text-[18px] font-semibold text-neutral-900 truncate">
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 w-8 h-8 flex items-center justify-center border border-neutral-300 rounded-[2px] hover:bg-neutral-100 transition-colors"
                  aria-label="Close inspector"
                >
                  <X size={16} className="text-neutral-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Inspector Panel Content Sections
 */

export function InspectorSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <h3 className="font-mono text-[11px] uppercase tracking-widest text-neutral-500 mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function InspectorField({
  label,
  value,
  mono = false,
  link,
}: {
  label: string;
  value: string;
  mono?: boolean;
  link?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-neutral-100 last:border-0">
      <dt className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 shrink-0">
        {label}
      </dt>
      {link ? (
        <dd>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-right break-all hover:underline ${
              mono
                ? "font-mono text-[11px] text-indigo-600"
                : "font-sans text-[12px] text-neutral-900"
            }`}
          >
            {value}
          </a>
        </dd>
      ) : (
        <dd
          className={`text-right break-all ${
            mono
              ? "font-mono text-[11px] text-neutral-900"
              : "font-sans text-[12px] text-neutral-900"
          }`}
        >
          {value}
        </dd>
      )}
    </div>
  );
}

export function InspectorCard({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent?: "emerald" | "sky" | "amber" | "red";
}) {
  const colors = {
    emerald: "border-emerald-200 bg-emerald-50",
    sky: "border-sky-200 bg-sky-50",
    amber: "border-amber-200 bg-amber-50",
    red: "border-red-200 bg-red-50",
  };

  return (
    <div
      className={`border rounded-[2px] p-3 ${accent ? colors[accent] : "border-neutral-200 bg-white"}`}
    >
      {children}
    </div>
  );
}
