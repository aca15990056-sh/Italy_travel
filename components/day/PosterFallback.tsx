import type { DayPlan } from "@/data/dayPlans";

type PosterFallbackProps = {
  city: DayPlan["city"];
  country: DayPlan["country"];
  tone: DayPlan["tone"];
  silhouette?: DayPlan["silhouette"];
};

function CitySilhouette() {
  return (
    <svg viewBox="0 0 800 200" className="h-full w-full" aria-hidden="true">
      <rect width="800" height="200" fill="none" />
      <rect x="40" y="80" width="80" height="120" fill="currentColor" />
      <rect x="130" y="50" width="120" height="150" fill="currentColor" />
      <rect x="270" y="70" width="90" height="130" fill="currentColor" />
      <rect x="380" y="40" width="160" height="160" fill="currentColor" />
      <rect x="560" y="90" width="90" height="110" fill="currentColor" />
      <rect x="660" y="60" width="100" height="140" fill="currentColor" />
    </svg>
  );
}

function MountainSilhouette() {
  return (
    <svg viewBox="0 0 800 200" className="h-full w-full" aria-hidden="true">
      <path d="M0 200 L180 60 L320 200 Z" fill="currentColor" />
      <path d="M220 200 L420 40 L620 200 Z" fill="currentColor" />
      <path d="M520 200 L680 90 L800 200 Z" fill="currentColor" />
    </svg>
  );
}

function CoastSilhouette() {
  return (
    <svg viewBox="0 0 800 200" className="h-full w-full" aria-hidden="true">
      <path
        d="M0 140 C120 90, 260 190, 400 140 C540 90, 680 190, 800 140 L800 200 L0 200 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function PosterFallback({
  city,
  country,
  tone,
  silhouette
}: PosterFallbackProps) {
  return (
    <div
      className="relative h-full w-full"
      style={{
        background: `linear-gradient(135deg, ${tone.from}, ${tone.to})`
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center text-white/80">
          <div className="text-5xl font-semibold tracking-[0.2em]">
            {city}
          </div>
          <div className="mt-2 text-sm uppercase tracking-[0.4em] text-white/70">
            {country}
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-32 text-black/40">
        {silhouette === "mountain" ? (
          <MountainSilhouette />
        ) : silhouette === "coast" ? (
          <CoastSilhouette />
        ) : (
          <CitySilhouette />
        )}
      </div>
    </div>
  );
}
