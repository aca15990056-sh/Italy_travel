"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { DayPlan, Spot } from "@/data/itinerary";
import { getCache, setCache } from "@/lib/cache";
import { getMapsErrorMessage, loadGoogleMaps } from "@/lib/googleMaps";

type MapPanelProps = {
  day: DayPlan;
  spots: Spot[];
  selectedSpot: Spot | null;
  travelMode: "TRANSIT" | "DRIVING" | "WALKING";
  onTravelModeChange: (mode: "TRANSIT" | "DRIVING" | "WALKING") => void;
  onResolveSpot: (spotId: string, override: Partial<Spot>) => void;
};

type SegmentDetail = {
  from: string;
  to: string;
  distanceText: string;
  durationText: string;
  modeText: string;
};

type DirectionsSummary = {
  distanceText: string;
  durationText: string;
  segments: SegmentDetail[];
};

const DEFAULT_CENTER = { lat: 47.3769, lng: 8.5417 };

function buildSpotQuery(spot: Spot) {
  return `${spot.name} ${spot.city} ${spot.country}`.trim();
}

export default function MapPanel({
  day,
  spots,
  selectedSpot,
  travelMode,
  onTravelModeChange,
  onResolveSpot
}: MapPanelProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const directionsRendererRef =
    useRef<google.maps.DirectionsRenderer | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(
    null
  );
  const directionsCacheRef = useRef<Map<string, google.maps.DirectionsResult>>(
    new Map()
  );

  const [mapsError, setMapsError] = useState<string | null>(null);
  const [routeRequested, setRouteRequested] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [directionsSummary, setDirectionsSummary] =
    useState<DirectionsSummary | null>(null);

  const dayCenter = useMemo(() => {
    const withCoords = spots.filter((spot) => spot.lat && spot.lng);
    if (!withCoords.length) return DEFAULT_CENTER;
    const avgLat =
      withCoords.reduce((sum, spot) => sum + (spot.lat ?? 0), 0) /
      withCoords.length;
    const avgLng =
      withCoords.reduce((sum, spot) => sum + (spot.lng ?? 0), 0) /
      withCoords.length;
    return { lat: avgLat, lng: avgLng };
  }, [spots]);

  useEffect(() => {
    let mounted = true;
    loadGoogleMaps()
      .then((google) => {
        if (!mounted || !mapRef.current) return;
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new google.maps.Map(mapRef.current, {
            center: dayCenter,
            zoom: 12,
            mapTypeControl: false,
            streetViewControl: false
          });
          directionsRendererRef.current = new google.maps.DirectionsRenderer({
            suppressMarkers: true
          });
          directionsRendererRef.current.setMap(mapInstanceRef.current);
          placesServiceRef.current = new google.maps.places.PlacesService(
            mapInstanceRef.current
          );
        } else {
          mapInstanceRef.current.setCenter(dayCenter);
        }
      })
      .catch((error) => {
        if (!mounted) return;
        setMapsError(getMapsErrorMessage(error));
      });
    return () => {
      mounted = false;
    };
  }, [dayCenter]);

  useEffect(() => {
    setRouteRequested(false);
    setDirectionsSummary(null);
    setRouteError(null);
  }, [day.day]);

  useEffect(() => {
    if (!mapInstanceRef.current || mapsError) return;
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    spots.forEach((spot) => {
      if (spot.lat == null || spot.lng == null) return;
      const marker = new google.maps.Marker({
        position: { lat: spot.lat, lng: spot.lng },
        map: mapInstanceRef.current,
        title: spot.name
      });
      markersRef.current.push(marker);
    });
  }, [spots, mapsError]);

  useEffect(() => {
    if (!mapInstanceRef.current || !selectedSpot || mapsError) return;
    if (selectedSpot.lat != null && selectedSpot.lng != null) {
      mapInstanceRef.current.panTo({
        lat: selectedSpot.lat,
        lng: selectedSpot.lng
      });
      mapInstanceRef.current.setZoom(13);
      return;
    }
    resolveSpotLocation(selectedSpot).catch(() => {
      // handled in resolveSpotLocation
    });
  }, [selectedSpot, mapsError]);

  useEffect(() => {
    if (!routeRequested) return;
    handleComputeRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travelMode]);

  const resolveSpotLocation = async (spot: Spot) => {
    if (!placesServiceRef.current) return;
    const cacheKey = `spot-location:${spot.id}`;
    const cached = getCache<{ lat: number; lng: number; placeId?: string }>(
      cacheKey
    );
    if (cached) {
      onResolveSpot(spot.id, cached);
      return;
    }

    if (spot.placeId) {
      await new Promise<void>((resolve, reject) => {
        placesServiceRef.current?.getDetails(
          {
            placeId: spot.placeId,
            fields: ["geometry", "place_id"]
          },
          (place, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
              reject(new Error("PLACE_DETAILS_FAILED"));
              return;
            }
            const location = place.geometry?.location;
            if (!location) {
              reject(new Error("NO_LOCATION"));
              return;
            }
            const resolved = {
              lat: location.lat(),
              lng: location.lng(),
              placeId: place.place_id ?? spot.placeId
            };
            setCache(cacheKey, resolved);
            onResolveSpot(spot.id, resolved);
            resolve();
          }
        );
      });
      return;
    }

    await new Promise<void>((resolve, reject) => {
      placesServiceRef.current?.textSearch(
        { query: buildSpotQuery(spot) },
        (results, status) => {
          if (
            status !== google.maps.places.PlacesServiceStatus.OK ||
            !results ||
            !results[0]
          ) {
            reject(new Error("TEXT_SEARCH_FAILED"));
            return;
          }
          const location = results[0].geometry?.location;
          if (!location) {
            reject(new Error("NO_LOCATION"));
            return;
          }
          const resolved = {
            lat: location.lat(),
            lng: location.lng(),
            placeId: results[0].place_id
          };
          setCache(cacheKey, resolved);
          onResolveSpot(spot.id, resolved);
          resolve();
        }
      );
    });
  };

  const buildDirectionsSummary = (result: google.maps.DirectionsResult) => {
    const route = result.routes[0];
    const legs = route.legs ?? [];
    const distanceMeters = legs.reduce(
      (sum, leg) => sum + (leg.distance?.value ?? 0),
      0
    );
    const durationSeconds = legs.reduce(
      (sum, leg) => sum + (leg.duration?.value ?? 0),
      0
    );
    const segments: SegmentDetail[] = legs.map((leg, index) => {
      const steps = leg.steps ?? [];
      const modes = new Set<string>();
      steps.forEach((step) => {
        if (step.travel_mode === google.maps.TravelMode.TRANSIT) {
          const lineName =
            step.transit_details?.line?.short_name ??
            step.transit_details?.line?.name;
          const vehicleType = step.transit_details?.line?.vehicle?.type;
          modes.add(
            lineName
              ? `TRANSIT (${lineName})`
              : vehicleType
              ? `TRANSIT (${vehicleType})`
              : "TRANSIT"
          );
        } else {
          modes.add(step.travel_mode);
        }
      });
      return {
        from: leg.start_address || `Stop ${index + 1}`,
        to: leg.end_address || `Stop ${index + 2}`,
        distanceText: leg.distance?.text ?? "-",
        durationText: leg.duration?.text ?? "-",
        modeText: modes.size ? Array.from(modes).join(", ") : travelMode
      };
    });
    return {
      distanceText: `${(distanceMeters / 1000).toFixed(1)} km`,
      durationText: `${Math.round(durationSeconds / 60)} 분`,
      segments
    };
  };

  const buildRouteCacheKey = (spotsToRoute: Spot[]) => {
    const signature = spotsToRoute
      .map((spot) => spot.placeId || `${spot.lat},${spot.lng}`)
      .join(">");
    return `directions:${day.day}:${travelMode}:${signature}`;
  };

  const handleComputeRoute = async () => {
    if (!mapInstanceRef.current || !directionsRendererRef.current) return;
    setRouteError(null);
    setRouteLoading(true);

    const spotsToRoute = [...spots];
    for (const spot of spotsToRoute) {
      if (spot.lat == null || spot.lng == null) {
        try {
          await resolveSpotLocation(spot);
        } catch {
          setRouteError(
            "일부 스팟의 위치를 찾지 못했습니다. 스팟을 먼저 클릭해 확인하세요."
          );
          setRouteLoading(false);
          return;
        }
      }
    }

    const cacheKey = buildRouteCacheKey(spotsToRoute);
    const cached = directionsCacheRef.current.get(cacheKey);
    if (cached) {
      directionsRendererRef.current.setDirections(cached);
      setDirectionsSummary(buildDirectionsSummary(cached));
      setRouteLoading(false);
      return;
    }

    const origin = spotsToRoute[0];
    const destination = spotsToRoute[spotsToRoute.length - 1];
    if (!origin || !destination) {
      setRouteError("경로 계산을 위한 스팟이 부족합니다.");
      setRouteLoading(false);
      return;
    }

    const waypoints = spotsToRoute
      .slice(1, -1)
      .map((spot) => ({
        location:
          spot.placeId && !spot.lat
            ? { placeId: spot.placeId }
            : { lat: spot.lat ?? 0, lng: spot.lng ?? 0 },
        stopover: true
      }));

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin:
          origin.placeId && !origin.lat
            ? { placeId: origin.placeId }
            : { lat: origin.lat ?? 0, lng: origin.lng ?? 0 },
        destination:
          destination.placeId && !destination.lat
            ? { placeId: destination.placeId }
            : { lat: destination.lat ?? 0, lng: destination.lng ?? 0 },
        waypoints,
        travelMode
      },
      (result, status) => {
        if (status !== google.maps.DirectionsStatus.OK || !result) {
          setRouteError(
            status === google.maps.DirectionsStatus.OVER_QUERY_LIMIT
              ? "쿼터 초과로 경로 조회가 제한되었습니다."
              : "경로 조회 실패. 네트워크 상태를 확인하세요."
          );
          setRouteLoading(false);
          return;
        }
        directionsCacheRef.current.set(cacheKey, result);
        directionsRendererRef.current?.setDirections(result);
        setDirectionsSummary(buildDirectionsSummary(result));
        setRouteLoading(false);
      }
    );
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">지도 & 경로</h2>
          <p className="text-sm text-gray-500">
            Day {day.day} 스팟을 지도에서 확인하세요.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">이동수단</label>
          <select
            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
            value={travelMode}
            onChange={(event) =>
              onTravelModeChange(event.target.value as MapPanelProps["travelMode"])
            }
          >
            <option value="TRANSIT">대중교통</option>
            <option value="DRIVING">차량</option>
            <option value="WALKING">도보</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setRouteRequested(true);
              handleComputeRoute();
            }}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            Day 전체 경로 보기
          </button>
        </div>
      </div>

      {mapsError ? (
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {mapsError}
        </div>
      ) : (
        <div className="mt-4 h-[360px] w-full rounded-md border border-gray-200">
          <div ref={mapRef} className="h-full w-full" />
        </div>
      )}

      <div className="mt-4">
        {routeLoading && (
          <div className="text-sm text-gray-500">경로 계산 중...</div>
        )}
        {routeError && (
          <div className="text-sm text-rose-600">{routeError}</div>
        )}
        {directionsSummary && !routeLoading && (
          <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
            <div className="font-semibold text-gray-900">
              총 이동거리: {directionsSummary.distanceText} · 총 소요시간:{" "}
              {directionsSummary.durationText}
            </div>
            <div className="mt-2 space-y-2">
              {directionsSummary.segments.map((segment) => (
                <div key={`${segment.from}-${segment.to}`}>
                  <div className="font-medium text-gray-800">
                    {segment.from} → {segment.to}
                  </div>
                  <div className="text-xs text-gray-600">
                    {segment.distanceText} · {segment.durationText} ·{" "}
                    {segment.modeText}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
