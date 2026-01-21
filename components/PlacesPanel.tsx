"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { DayPlan, Spot } from "@/data/itinerary";
import { getCache, setCache } from "@/lib/cache";
import { getMapsErrorMessage, loadGoogleMaps } from "@/lib/googleMaps";

type PlacesPanelProps = {
  day: DayPlan;
  selectedSpot: Spot | null;
  onResolveSpot: (spotId: string, override: Partial<Spot>) => void;
  requested: boolean;
  onRequest: () => void;
};

type PlaceResult = {
  place_id: string;
  name: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  vicinity?: string;
  formatted_address?: string;
  geometry?: google.maps.places.PlaceGeometry;
};

const DEFAULT_RADIUS = 1500;

function scorePlace(place: PlaceResult) {
  if (!place.rating || !place.user_ratings_total) return -1;
  const reviewScore = Math.log10(place.user_ratings_total + 1) * 5;
  return place.rating * 10 + reviewScore;
}

function priceLabel(level?: number) {
  if (level == null) return "-";
  return "₩".repeat(Math.max(1, Math.min(level + 1, 4)));
}

function buildMapsLink(place: PlaceResult) {
  if (place.place_id) {
    return `https://www.google.com/maps/search/?api=1&query_place_id=${place.place_id}`;
  }
  const query = encodeURIComponent(place.name);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function buildDirectionsLink(place: PlaceResult) {
  if (place.place_id) {
    return `https://www.google.com/maps/dir/?api=1&destination=place_id:${place.place_id}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    place.name
  )}`;
}

export default function PlacesPanel({
  day,
  selectedSpot,
  onResolveSpot,
  requested,
  onRequest
}: PlacesPanelProps) {
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const [mapsError, setMapsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const center = useMemo(() => {
    if (selectedSpot?.lat != null && selectedSpot.lng != null) {
      return { lat: selectedSpot.lat, lng: selectedSpot.lng };
    }
    const withCoords = day.spots.filter((spot) => spot.lat && spot.lng);
    if (!withCoords.length) return null;
    const avgLat =
      withCoords.reduce((sum, spot) => sum + (spot.lat ?? 0), 0) /
      withCoords.length;
    const avgLng =
      withCoords.reduce((sum, spot) => sum + (spot.lng ?? 0), 0) /
      withCoords.length;
    return { lat: avgLat, lng: avgLng };
  }, [day.spots, selectedSpot]);

  useEffect(() => {
    let mounted = true;
    loadGoogleMaps()
      .then((google) => {
        if (!mounted) return;
        if (!placesServiceRef.current) {
          const dummyDiv = document.createElement("div");
          placesServiceRef.current = new google.maps.places.PlacesService(
            dummyDiv
          );
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setMapsError(getMapsErrorMessage(err));
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!requested || !center || !placesServiceRef.current || mapsError) return;

    const cacheKey = `places:${selectedSpot?.id ?? `day-${day.day}`}:${
      center.lat
    },${center.lng}`;
    const cached = getCache<PlaceResult[]>(cacheKey);
    if (cached) {
      setPlaces(cached);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const search = (openNow: boolean, fallback = false) => {
      placesServiceRef.current?.nearbySearch(
        {
          location: center,
          radius: DEFAULT_RADIUS,
          type: "restaurant",
          openNow
        },
        (results, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT
          ) {
            setError("쿼터 초과로 맛집 조회가 제한되었습니다.");
            setLoading(false);
            return;
          }
          if (
            status !== google.maps.places.PlacesServiceStatus.OK ||
            !results ||
            results.length === 0
          ) {
            if (openNow && !fallback) {
              search(false, true);
              return;
            }
            setError("맛집 결과가 없습니다. 위치를 변경해 보세요.");
            setLoading(false);
            return;
          }

          const ranked = results
            .map((place) => ({
              place_id: place.place_id ?? "",
              name: place.name ?? "",
              rating: place.rating ?? undefined,
              user_ratings_total: place.user_ratings_total ?? undefined,
              price_level: place.price_level ?? undefined,
              vicinity: place.vicinity ?? undefined,
              formatted_address: place.formatted_address ?? undefined,
              geometry: place.geometry ?? undefined
            }))
            .filter((place) => place.name)
            .map((place) => ({
              place,
              score: scorePlace(place)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map((item) => item.place);

          setPlaces(ranked);
          setCache(cacheKey, ranked);
          setLoading(false);
        }
      );
    };

    search(true);
  }, [center, day.day, mapsError, requested, selectedSpot?.id]);

  useEffect(() => {
    if (!selectedSpot || selectedSpot.lat != null || !placesServiceRef.current)
      return;
    const cacheKey = `spot-location:${selectedSpot.id}`;
    const cached = getCache<{ lat: number; lng: number; placeId?: string }>(
      cacheKey
    );
    if (cached) {
      onResolveSpot(selectedSpot.id, cached);
      return;
    }

    placesServiceRef.current.textSearch(
      { query: `${selectedSpot.name} ${selectedSpot.city}` },
      (results, status) => {
        if (
          status !== google.maps.places.PlacesServiceStatus.OK ||
          !results?.[0]
        ) {
          return;
        }
        const location = results[0].geometry?.location;
        if (!location) return;
        const resolved = {
          lat: location.lat(),
          lng: location.lng(),
          placeId: results[0].place_id
        };
        setCache(cacheKey, resolved);
        onResolveSpot(selectedSpot.id, resolved);
      }
    );
  }, [selectedSpot, onResolveSpot]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">맛집 추천</h2>
          <p className="text-sm text-gray-500">
            {selectedSpot
              ? `${selectedSpot.name} 주변 1~2km`
              : `Day ${day.day} 중심 기준`}
          </p>
        </div>
        <button
          type="button"
          onClick={onRequest}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          맛집 조회
        </button>
      </div>

      {mapsError && (
        <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {mapsError}
        </div>
      )}

      {!center && !mapsError && (
        <div className="mt-3 text-sm text-gray-500">
          위치 정보가 부족해 맛집을 찾을 수 없습니다. 스팟을 선택해
          위치정보를 보완하세요.
        </div>
      )}

      {!requested && !mapsError && center && (
        <div className="mt-3 text-sm text-gray-500">
          맛집 조회를 위해 위 버튼을 클릭하세요. (요금/쿼터 절감 목적)
        </div>
      )}

      {loading && (
        <div className="mt-3 text-sm text-gray-500">맛집 조회 중...</div>
      )}
      {error && <div className="mt-3 text-sm text-rose-600">{error}</div>}

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {places.map((place) => (
          <div
            key={place.place_id || place.name}
            className="rounded-md border border-gray-200 p-3 text-sm"
          >
            <div className="font-semibold text-gray-900">{place.name}</div>
            <div className="text-xs text-gray-500">
              평점 {place.rating ?? "-"} · 리뷰{" "}
              {place.user_ratings_total ?? "-"} · 가격대{" "}
              {priceLabel(place.price_level)}
            </div>
            <div className="mt-1 text-xs text-gray-600">
              {place.vicinity || place.formatted_address || "-"}
            </div>
            <div className="mt-2 flex gap-2">
              <a
                className="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                href={buildMapsLink(place)}
                target="_blank"
                rel="noreferrer"
              >
                Google Maps
              </a>
              <a
                className="rounded-md bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                href={buildDirectionsLink(place)}
                target="_blank"
                rel="noreferrer"
              >
                길찾기
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
