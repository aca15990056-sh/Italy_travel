"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { DayPlan } from "@/data/dayPlans";
import TimeFlow from "@/components/day/TimeFlow";
import PosterFallback from "@/components/day/PosterFallback";

type DaySectionProps = {
  day: DayPlan;
};

export default function DaySection({ day }: DaySectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const backgroundScale = useTransform(scrollYProgress, [0, 0.5], [1.08, 1]);
  const backgroundY = useTransform(scrollYProgress, [0, 0.5], [40, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.1, 0.35], [18, 0]);
  const fadeOut = useTransform(scrollYProgress, [0.7, 1], [1, 0.55]);
  const flashOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);
  const flashTranslate = useTransform(scrollYProgress, [0.15, 0.35], [12, 0]);

  return (
    <motion.section
      ref={ref}
      className="relative h-[100svh] w-full overflow-hidden"
      style={{ opacity: shouldReduceMotion ? 1 : fadeOut }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          scale: shouldReduceMotion ? 1 : backgroundScale,
          y: shouldReduceMotion ? 0 : backgroundY
        }}
      >
        {day.heroVideo && !shouldReduceMotion ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={day.heroImage}
          >
            <source src={day.heroVideo} type="video/mp4" />
          </video>
        ) : day.heroImage ? (
          <img
            src={day.heroImage}
            alt={`${day.title} 배경`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <PosterFallback
            city={day.city}
            country={day.country}
            tone={day.tone}
            silhouette={day.silhouette}
          />
        )}
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(120deg, ${day.tone.from}aa, ${day.tone.to}aa)`
        }}
      />

      <div className="absolute inset-y-0 left-0 z-10 hidden w-56 flex-col justify-center px-6 lg:flex">
        <motion.div
          className="flex flex-col gap-4 text-white"
          style={{
            opacity: shouldReduceMotion ? 1 : flashOpacity,
            x: shouldReduceMotion ? 0 : flashTranslate
          }}
        >
          <div className="text-xs uppercase tracking-[0.4em] text-white/70">
            Timetable
          </div>
          <div className="space-y-4 text-sm text-white/90">
            {day.timeline.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                  {item.label}
                </div>
                <div className="text-base font-semibold">{item.caption}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <motion.div
          className="flex flex-col items-center gap-3"
          style={{
            opacity: shouldReduceMotion ? 1 : titleOpacity,
            y: shouldReduceMotion ? 0 : titleY
          }}
        >
          <div className="text-xs uppercase tracking-[0.4em] text-white/70">
            Day {day.day} · {day.city} · {day.country}
          </div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            {day.title}
          </h2>
          <p className="text-lg text-white/90 sm:text-xl">{day.summary}</p>
        </motion.div>
      </div>

      <div className="absolute inset-x-6 bottom-8 z-10 text-white">
        <TimeFlow items={day.timeline} progress={scrollYProgress} />
      </div>
    </motion.section>
  );
}
