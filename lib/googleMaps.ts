import { Loader } from "@googlemaps/js-api-loader";

let loaderPromise: Promise<typeof google> | null = null;

export function loadGoogleMaps() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps must load in the browser."));
  }
  if (loaderPromise) return loaderPromise;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    loaderPromise = Promise.reject(new Error("MISSING_API_KEY"));
    return loaderPromise;
  }

  const loader = new Loader({
    apiKey,
    version: "weekly",
    libraries: ["places"]
  });

  loaderPromise = loader.load();
  return loaderPromise;
}

export function getMapsErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "MISSING_API_KEY") {
      return "Google Maps API Key가 없습니다. NEXT_PUBLIC_GOOGLE_MAPS_API_KEY를 설정하세요.";
    }
    return `지도 로딩 오류: ${error.message}`;
  }
  return "지도 로딩 중 알 수 없는 오류가 발생했습니다.";
}
