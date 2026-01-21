"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import type { TimeFlowItem } from "@/data/dayPlans";

type TimeFlowProps = {
  items: TimeFlowItem[];
  progress: MotionValue<number>;
};

function TimeDot({
  index,
  total,
  progress,
  reducedMotion
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const position = total === 1 ? 50 : (index / (total - 1)) * 90 + 5;
  const dotProgress = useTransform(
    progress,
    [0.15 + index * 0.1, 0.35 + index * 0.1],
    [0, 1]
  );

  return (
    <motion.circle
      cx={position}
      cy={6}
      r={2.8}
      className="fill-white"
      style={{ opacity: reducedMotion ? 1 : dotProgress }}
    />
  );
}

export default function TimeFlow({ items, progress }: TimeFlowProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const pathLength = useTransform(progress, [0.15, 0.6], [0, 1]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <motion.svg viewBox="0 0 100 12" className="h-6 w-full">
          <motion.path
            d="M5 6 L95 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-white/80"
            style={{
              pathLength: shouldReduceMotion ? 1 : pathLength
            }}
          />
          {items.map((_, index) => (
            <TimeDot
              key={`dot-${index}`}
              index={index}
              total={items.length}
              progress={progress}
              reducedMotion={shouldReduceMotion}
            />
          ))}
        </motion.svg>
      </div>
      <div className="grid gap-3 text-xs text-white/80 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
              {item.label}
            </span>
            <span className="text-sm text-white">{item.caption}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
