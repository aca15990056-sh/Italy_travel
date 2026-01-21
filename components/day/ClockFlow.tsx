"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export default function ClockFlow() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const rotation = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 hidden sm:block">
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-white/15 bg-black/40 px-5 py-4 text-white shadow-2xl backdrop-blur">
        <div className="relative h-32 w-32 rounded-full border border-white/40">
          <div className="absolute inset-3 rounded-full border border-white/15" />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.3em] text-white/60">
            Time
          </div>
          {[0, 3, 6, 9].map((tick) => (
            <div
              key={tick}
              className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60"
              style={{ transform: `translate(-50%, -50%) rotate(${tick * 30}deg) translateY(-52px)` }}
            />
          ))}
          <motion.div
            className="absolute inset-0 flex items-start justify-center"
            style={{
              rotate: shouldReduceMotion ? 0 : rotation
            }}
          >
            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-lg text-black shadow">
              🚶
            </div>
          </motion.div>
        </div>
        <div className="text-xs text-white/70">시간의 흐름</div>
      </div>
    </div>
  );
}
