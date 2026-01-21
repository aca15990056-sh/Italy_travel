"use client";

import ClockFlow from "@/components/day/ClockFlow";
import DaySection from "@/components/day/DaySection";
import { dayPlans } from "@/data/dayPlans";

export default function DayDeck() {
  return (
    <div className="bg-black">
      <ClockFlow />
      {dayPlans.map((day) => (
        <DaySection key={day.day} day={day} />
      ))}
    </div>
  );
}
