"use client";

import { useMemo, useState } from "react";
import DayList from "@/components/DayList";
import MapPanel from "@/components/MapPanel";
import PlacesPanel from "@/components/PlacesPanel";
import type { DayPlan, Spot } from "@/data/itinerary";

type ItineraryLayoutProps = {
  days: DayPlan[];
};

type SpotOverride = {
  lat?: number;
  lng?: number;
  placeId?: string;
};

export default function ItineraryLayout({ days }: ItineraryLayoutProps) {
  const initialDay = days[0]?.day ?? 1;
  const [selectedDayNumber, setSelectedDayNumber] = useState(initialDay);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(
    days[0]?.spots[0]?.id ?? null
  );
  const [travelMode, setTravelMode] = useState<
    "TRANSIT" | "DRIVING" | "WALKING"
  >(days[0]?.moveModeDefault ?? "TRANSIT");
  const [placesRequested, setPlacesRequested] = useState(false);
  const [spotOverrides, setSpotOverrides] = useState<
    Record<string, SpotOverride>
  >({});

  const selectedDay = useMemo(
    () => days.find((day) => day.day === selectedDayNumber) ?? days[0],
    [days, selectedDayNumber]
  );

  const resolvedSpots: Spot[] = useMemo(() => {
    if (!selectedDay) return [];
    return selectedDay.spots.map((spot) => ({
      ...spot,
      ...spotOverrides[spot.id]
    }));
  }, [selectedDay, spotOverrides]);

  const selectedSpot = useMemo(
    () => resolvedSpots.find((spot) => spot.id === selectedSpotId) ?? null,
    [resolvedSpots, selectedSpotId]
  );

  const handleSelectDay = (dayNumber: number) => {
    const day = days.find((item) => item.day === dayNumber);
    if (!day) return;
    setSelectedDayNumber(dayNumber);
    setTravelMode(day.moveModeDefault);
    setSelectedSpotId(day.spots[0]?.id ?? null);
    setPlacesRequested(false);
  };

  const handleSelectSpot = (spotId: string) => {
    setSelectedSpotId(spotId);
    setPlacesRequested(true);
  };

  const handleResolveSpot = (spotId: string, override: SpotOverride) => {
    setSpotOverrides((prev) => ({
      ...prev,
      [spotId]: {
        ...prev[spotId],
        ...override
      }
    }));
  };

  if (!selectedDay) {
    return <div className="p-6 text-sm text-gray-600">일정 데이터 없음</div>;
  }

  return (
    <div className="flex h-screen w-full flex-col bg-gray-100 md:flex-row">
      <div className="h-64 w-full md:h-full md:w-80">
        <DayList
          days={days}
          selectedDay={selectedDay.day}
          onSelectDay={handleSelectDay}
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-1">
            <div className="text-sm text-gray-500">{selectedDay.date}</div>
            <h1 className="text-xl font-semibold text-gray-900">
              {`Day ${selectedDay.day}. ${selectedDay.title}`}
            </h1>
            <div className="text-sm text-gray-600">
              {`Base: ${selectedDay.baseCity}`}
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                스팟 리스트
              </h3>
              <div className="mt-2 flex flex-col gap-2">
                {resolvedSpots.map((spot) => {
                  const active = spot.id === selectedSpotId;
                  return (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={() => handleSelectSpot(spot.id)}
                      className={`rounded-md border px-3 py-2 text-left text-sm ${
                        active
                          ? "border-blue-500 bg-blue-50 text-blue-900"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{spot.name}</div>
                        {spot.timeBlock && (
                          <span className="text-xs text-gray-500">
                            {spot.timeBlock}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {spot.city}, {spot.country}
                      </div>
                      {spot.note && (
                        <div className="text-xs text-amber-700">{spot.note}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                설명/팁 콘텐츠
              </h3>
              {selectedSpot ? (
                <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm">
                  <div className="font-semibold text-gray-900">
                    {selectedSpot.name}
                  </div>
                  {selectedSpot.content?.summary && (
                    <p className="mt-1 text-gray-700">
                      {selectedSpot.content.summary}
                    </p>
                  )}
                  {selectedSpot.content?.history && (
                    <p className="mt-2 text-gray-700">
                      {selectedSpot.content.history}
                    </p>
                  )}
                  {selectedSpot.content?.highlights?.length ? (
                    <ul className="mt-2 list-disc pl-4 text-gray-700">
                      {selectedSpot.content.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  {selectedSpot.content?.tips?.length ? (
                    <ul className="mt-2 list-disc pl-4 text-gray-700">
                      {selectedSpot.content.tips.map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                  ) : null}
                  {!selectedSpot.content && (
                    <p className="mt-2 text-gray-500">
                      상세 설명 콘텐츠 준비 중.
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-2 text-sm text-gray-500">
                  스팟을 선택하세요.
                </div>
              )}
            </div>
          </div>
        </div>
        <MapPanel
          day={selectedDay}
          spots={resolvedSpots}
          selectedSpot={selectedSpot}
          travelMode={travelMode}
          onTravelModeChange={setTravelMode}
          onResolveSpot={handleResolveSpot}
        />
        <PlacesPanel
          day={selectedDay}
          selectedSpot={selectedSpot}
          onResolveSpot={handleResolveSpot}
          requested={placesRequested}
          onRequest={() => setPlacesRequested(true)}
        />
      </div>
    </div>
  );
}
