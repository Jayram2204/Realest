import { motion } from "motion/react";

const shimmer = {
  hidden: { backgroundPosition: "-200% 0" },
  visible: {
    backgroundPosition: "200% 0",
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: "linear",
    },
  },
};

export function PropertyCardSkeleton() {
  return (
    <div className="border border-neutral-200 rounded-[2px] p-3 bg-white">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <motion.div
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className="h-4 w-3/4 rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]"
            />
            <motion.div
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className="h-3 w-1/2 rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]"
            />
          </div>
          <motion.div
            variants={shimmer}
            initial="hidden"
            animate="visible"
            className="h-4 w-4 rounded-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]"
          />
        </div>
        <div className="flex items-center justify-between">
          <motion.div
            variants={shimmer}
            initial="hidden"
            animate="visible"
            className="h-4 w-20 rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]"
          />
          <motion.div
            variants={shimmer}
            initial="hidden"
            animate="visible"
            className="h-3 w-12 rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]"
          />
        </div>
        <motion.div
          variants={shimmer}
          initial="hidden"
          animate="visible"
          className="h-6 w-16 rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]"
        />
      </div>
    </div>
  );
}

export function PanelSkeleton() {
  return (
    <div className="border border-neutral-300 rounded-[2px] bg-white p-4">
      <div className="space-y-3">
        <motion.div
          variants={shimmer}
          initial="hidden"
          animate="visible"
          className="h-5 w-32 rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]"
        />
        <motion.div
          variants={shimmer}
          initial="hidden"
          animate="visible"
          className="h-40 w-full rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]"
        />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              variants={shimmer}
              initial="hidden"
              animate="visible"
              className="h-4 w-full rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="h-[200px] flex items-end justify-around gap-2 p-4">
      {[40, 60, 45, 70, 55, 80, 65, 75, 50, 85].map((height, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className="flex-1 bg-gradient-to-t from-neutral-300 to-neutral-200 rounded-t"
        />
      ))}
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="grid grid-cols-5 gap-4 py-3 border-b border-neutral-200">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          variants={shimmer}
          initial="hidden"
          animate="visible"
          className="h-4 rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  );
}

export function FinancialWidgetSkeleton() {
  return (
    <div className="border border-neutral-300 rounded-[2px] bg-white p-4 space-y-4">
      <motion.div
        variants={shimmer}
        initial="hidden"
        animate="visible"
        className="h-6 w-40 rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]"
      />
      <motion.div
        variants={shimmer}
        initial="hidden"
        animate="visible"
        className="h-24 w-full rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]"
      />
      <div className="grid grid-cols-2 gap-3">
        {[1, 2].map((i) => (
          <motion.div
            key={i}
            variants={shimmer}
            initial="hidden"
            animate="visible"
            className="h-16 rounded bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]"
          />
        ))}
      </div>
    </div>
  );
}
