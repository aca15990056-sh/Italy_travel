"use client";

import type { DayPlan } from "@/data/itinerary";

type DayListProps = {
  days: DayPlan[];
  selectedDay: number;
  onSelectDay: (day: number) => void;
};

export default function DayList({
  days,
  selectedDay,
  onSelectDay
}: DayListProps) {
  const firstDay = days[0]?.day ?? 1;
  const lastDay = days[days.length - 1]?.day ?? firstDay;

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto border-r border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {`일정 (Day ${firstDay}~${lastDay})`}
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        {days.map((day) => {
          const isActive = day.day === selectedDay;
          return (
            <div key={day.day} className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onSelectDay(day.day)}
                className={`rounded-md border px-3 py-2 text-left text-sm transition ${
                  isActive
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="font-medium">{`Day ${day.day}`}</div>
                <div className="text-xs text-gray-500">{day.date}</div>
                <div className="mt-1 text-sm text-gray-700">{day.title}</div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
