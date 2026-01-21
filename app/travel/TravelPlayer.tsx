"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { clips } from "@/app/travel/timeline";
import { clamp, formatTime } from "@/app/travel/utils";
import { pretendardBoldClass, pretendardBoldStyle } from "@/app/travel/fonts";

const TRANSITION_MS = 800;
const DEFAULT_RATE = 0.8;
const MIN_RATE = 0.6;
const MAX_RATE = 1.25;
const FALLBACK_BGM_URL =
  "https://assets.mixkit.co/music/preview/mixkit-forest-trek-117.mp3";

type Layer = "A" | "B";
type TransitionType = "default" | "country" | "transfer" | "swipe";

export default function TravelPlayer() {
  const prefersReducedMotion = useReducedMotion();
  const videoARef = useRef<HTMLVideoElement | null>(null);
  const videoBRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  const fadeRafRef = useRef<number | null>(null);
  const endGuardRef = useRef(false);

  const [activeLayer, setActiveLayer] = useState<Layer>("A");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [bgmEnabled, setBgmEnabled] = useState(true);
  const [volume, setVolume] = useState(0.4);
  const [playbackRate, setPlaybackRate] = useState(DEFAULT_RATE);
  const [clipProgress, setClipProgress] = useState(0);
  const [clipDuration, setClipDuration] = useState(0);
  const [textVisible, setTextVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bgmError, setBgmError] = useState<string | null>(null);
  const [bgmSrc, setBgmSrc] = useState("/audio/bgm.mp3");
  const [transitionType, setTransitionType] = useState<TransitionType>("default");
  const [preloadedIndex, setPreloadedIndex] = useState<number | null>(null);
  const [preloadedReady, setPreloadedReady] = useState(false);

  const activeClip = clips[activeIndex];

  const getActiveVideo = useCallback(() => {
    return activeLayer === "A" ? videoARef.current : videoBRef.current;
  }, [activeLayer]);

  const getInactiveVideo = useCallback(() => {
    return activeLayer === "A" ? videoBRef.current : videoARef.current;
  }, [activeLayer]);

  const applyPlaybackRate = useCallback(
    (rate: number) => {
      [videoARef.current, videoBRef.current].forEach((video) => {
        if (!video) return;
        video.playbackRate = rate;
      });
    },
    []
  );

  const applyMuted = useCallback(
    (muted: boolean) => {
      [videoARef.current, videoBRef.current].forEach((video) => {
        if (!video) return;
        video.muted = muted;
      });
    },
    []
  );

  const playActive = useCallback(() => {
    const activeVideo = getActiveVideo();
    if (!activeVideo) return;
    activeVideo.play().catch(() => {
      setIsPlaying(false);
    });
  }, [getActiveVideo]);

  const pauseActive = useCallback(() => {
    const activeVideo = getActiveVideo();
    if (!activeVideo) return;
    activeVideo.pause();
  }, [getActiveVideo]);

  const resetTimers = useCallback(() => {
    setClipProgress(0);
    setClipDuration(0);
    setTextVisible(false);
    setPreloadedReady(false);
    setPreloadedIndex(null);
  }, []);

  const getTransitionType = useCallback(
    (currentIndex: number, targetIndex: number): TransitionType => {
      const current = clips[currentIndex];
      const next = clips[targetIndex];
      if (!current || !next) return "default";
      if (current.theme === "intro" || next.theme === "outro") return "default";
      if (targetIndex === 5) return "swipe";
      if (next.theme === "transfer") return "transfer";
      if (current.country !== next.country || current.city !== next.city) return "country";
      return "default";
    },
    []
  );

  const swapToIndex = useCallback(
    (targetIndex: number, activeVideo: HTMLVideoElement, inactiveVideo: HTMLVideoElement) => {
      const nextLayer: Layer = activeLayer === "A" ? "B" : "A";
      setTransitionType(getTransitionType(activeIndex, targetIndex));

      if (isPlaying) {
        inactiveVideo.play().catch(() => {
          setIsPlaying(false);
        });
      }

      setActiveLayer(nextLayer);
      setActiveIndex(targetIndex);

      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }

      transitionTimeoutRef.current = window.setTimeout(() => {
        activeVideo.pause();
        transitionTimeoutRef.current = null;
      }, TRANSITION_MS);
    },
    [activeIndex, activeLayer, getTransitionType, isPlaying]
  );

  const fadeAudioTo = useCallback(
    (target: number, durationMs: number, pauseAfter = false) => {
      const audio = audioRef.current;
      if (!audio) return;
      if (fadeRafRef.current) {
        cancelAnimationFrame(fadeRafRef.current);
      }
      const start = performance.now();
      const initial = audio.volume;

      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / durationMs);
        audio.volume = initial + (target - initial) * progress;
        if (progress < 1) {
          fadeRafRef.current = requestAnimationFrame(step);
        } else {
          fadeRafRef.current = null;
          if (pauseAfter) audio.pause();
        }
      };

      fadeRafRef.current = requestAnimationFrame(step);
    },
    []
  );

  const queueClip = useCallback(
    (targetIndex: number) => {
      if (targetIndex === activeIndex || targetIndex < 0 || targetIndex >= clips.length) {
        return;
      }

      const inactiveVideo = getInactiveVideo();
      const activeVideo = getActiveVideo();
      if (!inactiveVideo || !activeVideo) return;

      setErrorMessage(null);
      resetTimers();

      inactiveVideo.src = clips[targetIndex].videoSrc;
      inactiveVideo.currentTime = 0;
      inactiveVideo.muted = isMuted;
      inactiveVideo.playbackRate = playbackRate;
      inactiveVideo.load();
      setTransitionType(getTransitionType(activeIndex, targetIndex));

      const handleCanPlay = () => {
        inactiveVideo.removeEventListener("canplay", handleCanPlay);
        swapToIndex(targetIndex, activeVideo, inactiveVideo);
      };

      inactiveVideo.addEventListener("canplay", handleCanPlay);
    },
    [
      activeIndex,
      activeLayer,
      getTransitionType,
      getActiveVideo,
      getInactiveVideo,
      isMuted,
      isPlaying,
      playbackRate,
      resetTimers,
      swapToIndex
    ]
  );

  const handleNext = useCallback(() => {
    const nextIndex = (activeIndex + 1) % clips.length;
    queueClip(nextIndex);
  }, [activeIndex, queueClip]);

  const handlePrev = useCallback(() => {
    const prevIndex = (activeIndex - 1 + clips.length) % clips.length;
    queueClip(prevIndex);
  }, [activeIndex, queueClip]);

  const handleJump = useCallback(
    (targetIndex: number) => {
      if (!hasStarted) {
        setHasStarted(true);
      }

      if (!isPlaying) {
        setIsPlaying(true);
      }

      if (targetIndex === activeIndex) {
        playActive();
      } else {
        queueClip(targetIndex);
      }

      if (bgmEnabled && audioRef.current) {
        audioRef.current.play().catch(() => null);
        fadeAudioTo(volume, 500);
      }
    },
    [
      activeIndex,
      bgmEnabled,
      fadeAudioTo,
      hasStarted,
      isPlaying,
      playActive,
      queueClip,
      volume
    ]
  );

  const handleStart = useCallback(() => {
    setHasStarted(true);
    setIsPlaying(true);
    playActive();
    if (bgmEnabled && audioRef.current) {
      audioRef.current.play().catch(() => null);
      fadeAudioTo(volume, 600);
    }
  }, [bgmEnabled, fadeAudioTo, playActive, volume]);

  const handlePlayToggle = useCallback(() => {
    if (!hasStarted) {
      handleStart();
      return;
    }

    if (isPlaying) {
      pauseActive();
      if (audioRef.current) fadeAudioTo(0, 400, true);
      setIsPlaying(false);
    } else {
      playActive();
      if (bgmEnabled && audioRef.current) {
        audioRef.current.play().catch(() => null);
        fadeAudioTo(volume, 500);
      }
      setIsPlaying(true);
    }
  }, [
    bgmEnabled,
    fadeAudioTo,
    handleStart,
    hasStarted,
    isPlaying,
    pauseActive,
    playActive,
    volume
  ]);

  const handleRateChange = (value: number) => {
    const nextRate = clamp(value, MIN_RATE, MAX_RATE);
    setPlaybackRate(nextRate);
    applyPlaybackRate(nextRate);
  };

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    applyMuted(nextMuted);
  };

  const handleBgmToggle = () => {
    const nextEnabled = !bgmEnabled;
    setBgmEnabled(nextEnabled);
    if (!audioRef.current) return;
    if (nextEnabled && hasStarted) {
      audioRef.current.play().catch(() => null);
      fadeAudioTo(volume, 600);
    } else {
      fadeAudioTo(0, 500, true);
    }
  };

  useEffect(() => {
    const activeVideo = getActiveVideo();
    if (!activeVideo) return;

    const handleTimeUpdate = () => {
      const duration = activeVideo.duration || 0;
      const current = activeVideo.currentTime || 0;
      setClipDuration(duration);
      setClipProgress(duration ? current / duration : 0);
      const isVisible = current > 0.4 && duration - current > 0.4;
      setTextVisible(isVisible);
      const nextIndex = (activeIndex + 1) % clips.length;
      if (
        duration &&
        current >= duration - TRANSITION_MS / 1000 &&
        preloadedReady &&
        preloadedIndex === nextIndex &&
        !endGuardRef.current
      ) {
        endGuardRef.current = true;
        const inactiveVideo = getInactiveVideo();
        if (inactiveVideo) {
          swapToIndex(nextIndex, activeVideo, inactiveVideo);
        } else {
          handleNext();
        }
      }
    };

    const handleLoadedMetadata = () => {
      const duration = activeVideo.duration || 0;
      setClipDuration(duration);
    };

    const handleEnded = () => {
      endGuardRef.current = true;
      handleNext();
    };

    const handleError = () => {
      setErrorMessage("영상 파일을 찾을 수 없습니다.");
    };

    activeVideo.addEventListener("timeupdate", handleTimeUpdate);
    activeVideo.addEventListener("loadedmetadata", handleLoadedMetadata);
    activeVideo.addEventListener("ended", handleEnded);
    activeVideo.addEventListener("error", handleError);

    return () => {
      activeVideo.removeEventListener("timeupdate", handleTimeUpdate);
      activeVideo.removeEventListener("loadedmetadata", handleLoadedMetadata);
      activeVideo.removeEventListener("ended", handleEnded);
      activeVideo.removeEventListener("error", handleError);
      endGuardRef.current = false;
    };
  }, [
    activeIndex,
    activeLayer,
    getActiveVideo,
    getInactiveVideo,
    handleNext,
    preloadedIndex,
    preloadedReady,
    swapToIndex
  ]);

  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (hasInitializedRef.current) return;
    const activeVideo = getActiveVideo();
    if (!activeVideo) return;
    activeVideo.src = clips[0].videoSrc;
    activeVideo.muted = isMuted;
    activeVideo.playbackRate = playbackRate;
    activeVideo.load();
    hasInitializedRef.current = true;
  }, [getActiveVideo, isMuted, playbackRate]);

  useEffect(() => {
    applyPlaybackRate(playbackRate);
  }, [applyPlaybackRate, playbackRate]);

  useEffect(() => {
    applyMuted(isMuted);
  }, [applyMuted, isMuted]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
      if (fadeRafRef.current) {
        cancelAnimationFrame(fadeRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const inactiveVideo = getInactiveVideo();
    if (!inactiveVideo) return;
    const nextIndex = (activeIndex + 1) % clips.length;
    inactiveVideo.src = clips[nextIndex].videoSrc;
    inactiveVideo.muted = isMuted;
    inactiveVideo.playbackRate = playbackRate;
    inactiveVideo.load();

    const handleCanPlay = () => {
      setPreloadedIndex(nextIndex);
      setPreloadedReady(true);
    };

    inactiveVideo.addEventListener("canplay", handleCanPlay);
    return () => {
      inactiveVideo.removeEventListener("canplay", handleCanPlay);
    };
  }, [activeIndex, getInactiveVideo, isMuted, playbackRate]);

  useEffect(() => {
    let mounted = true;
    fetch("/audio/bgm.mp3", { method: "HEAD" })
      .then((response) => {
        if (!mounted) return;
        if (!response.ok) {
          setBgmSrc(FALLBACK_BGM_URL);
        }
      })
      .catch(() => {
        if (!mounted) return;
        setBgmSrc(FALLBACK_BGM_URL);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const overlayText = useMemo(() => {
    return (
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 flex flex-col items-end justify-end gap-2 px-8 pb-36 text-right text-white"
        style={{
          color: "#FFFFFF",
          textShadow: "0 4px 16px rgba(0,0,0,0.8)"
        }}
        animate={{
          opacity: textVisible ? 1 : 0,
          y: prefersReducedMotion ? 0 : textVisible ? 0 : 12
        }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.4,
          ease: "easeOut"
        }}
      >
        <div className="text-4xl sm:text-5xl md:text-6xl text-white">
          {activeClip.country} · {activeClip.city}
        </div>
        <div className="text-sm sm:text-base text-white">{activeClip.title}</div>
        <div className="text-sm sm:text-base text-white">
          {activeClip.landmark} · {activeClip.subtitle}
        </div>
      </motion.div>
    );
  }, [activeClip, prefersReducedMotion, textVisible]);

  const transitionPreset = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        duration: TRANSITION_MS / 1000,
        active: { opacity: 1 },
        inactive: { opacity: 0 }
      };
    }
    switch (transitionType) {
      case "transfer":
        return {
          duration: 0.9,
          active: { opacity: 1, scale: 1, x: 0, filter: "blur(0px)" },
          inactive: { opacity: 0, scale: 1.08, x: 60, filter: "blur(10px)" }
        };
      case "swipe":
        return {
          duration: 0.9,
          active: { opacity: 1, x: 0, filter: "blur(0px)" },
          inactive: { opacity: 0, x: 80, filter: "blur(8px)" }
        };
      case "country":
        return {
          duration: 0.8,
          active: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
          inactive: { opacity: 0, scale: 0.98, y: -20, filter: "blur(8px)" }
        };
      default:
        return {
          duration: TRANSITION_MS / 1000,
          active: { opacity: 1, scale: 1, filter: "blur(0px)" },
          inactive: { opacity: 0, scale: 1, filter: "blur(6px)" }
        };
    }
  }, [prefersReducedMotion, transitionType]);

  return (
    <div className={`relative h-screen w-screen overflow-hidden bg-black ${pretendardBoldClass}`}>
      <style jsx global>
        {pretendardBoldStyle}
      </style>
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={activeLayer === "A" ? transitionPreset.active : transitionPreset.inactive}
          transition={{ duration: transitionPreset.duration, ease: "easeOut" }}
        >
          <video
            ref={videoARef}
            className="h-full w-full object-cover"
            muted
            playsInline
            preload="auto"
            style={{ filter: "brightness(0.95) contrast(1.1) saturate(1.05)" }}
          />
        </motion.div>
        <motion.div
          className="absolute inset-0"
          animate={activeLayer === "B" ? transitionPreset.active : transitionPreset.inactive}
          transition={{ duration: transitionPreset.duration, ease: "easeOut" }}
        >
          <video
            ref={videoBRef}
            className="h-full w-full object-cover"
            muted
            playsInline
            preload="auto"
            style={{ filter: "brightness(0.95) contrast(1.1) saturate(1.05)" }}
          />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/65" />
        <div className="absolute inset-0 bg-[#4b2a16]/15 mix-blend-soft-light" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.75))]" />
        </div>
        <div className="absolute inset-0 opacity-15 mix-blend-soft-light">
          <div className="h-full w-full bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%222%22 height=%222%22 viewBox=%220 0 2 2%22><rect width=%222%22 height=%222%22 fill=%22%23000%22/><circle cx=%221%22 cy=%221%22 r=%220.25%22 fill=%22%23fff%22/></svg>')]" />
        </div>
      </div>

      <div className="absolute left-0 top-0 z-20 h-1 w-full bg-white/10">
        <div
          className="h-full bg-white"
          style={{ width: `${clipProgress * 100}%` }}
        />
      </div>

      <div className="absolute left-6 top-6 z-30 flex items-center gap-2">
        {clips.map((clip, index) => (
          <button
            key={clip.id}
            type="button"
            onClick={() => handleJump(index)}
            className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs ${
              index === activeIndex
                ? "border-white bg-white/20 text-white"
                : "border-white/40 text-white"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="absolute right-6 top-6 z-30 text-sm text-white">
        Clip {activeIndex + 1}/{clips.length}
      </div>

      {overlayText}

      <div className="absolute inset-x-6 bottom-6 z-30 flex flex-col gap-4 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs uppercase tracking-[0.4em] text-white">
            {activeClip.dayLabel}
          </div>
          <div className="text-xs text-white">
            {formatTime(clipProgress * clipDuration)} / {formatTime(clipDuration)}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur">
          <button
            type="button"
            onClick={handlePrev}
            className="rounded-full border border-white/30 px-4 py-1 text-sm"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={handlePlayToggle}
            className="rounded-full border border-white/30 px-4 py-1 text-sm"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="rounded-full border border-white/30 px-4 py-1 text-sm"
          >
            Next
          </button>
          <button
            type="button"
            onClick={handleMuteToggle}
            className="rounded-full border border-white/30 px-3 py-1 text-sm"
          >
            {isMuted ? "Muted" : "Sound"}
          </button>
          <button
            type="button"
            onClick={handleBgmToggle}
            className="rounded-full border border-white/30 px-3 py-1 text-sm"
          >
            {bgmEnabled ? "BGM On" : "BGM Off"}
          </button>
          <div className="flex items-center gap-2 text-xs text-white">
            <span>Vol</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-white">
            <span>Speed</span>
            <input
              type="range"
              min={MIN_RATE}
              max={MAX_RATE}
              step={0.05}
              value={playbackRate}
              onChange={(event) => handleRateChange(Number(event.target.value))}
            />
            <span>{playbackRate.toFixed(2)}x</span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="absolute inset-0 z-40 flex items-center justify-center">
          <div className="rounded-2xl border border-white/20 bg-black/70 px-6 py-4 text-white">
            <div className="text-lg">{errorMessage}</div>
            <button
              type="button"
              onClick={handleNext}
              className="mt-3 rounded-full border border-white/30 px-4 py-1 text-sm"
            >
              Next Clip
            </button>
          </div>
        </div>
      )}

      {!hasStarted && (
        <button
          type="button"
          onClick={handleStart}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 text-center text-white"
        >
          <div className="text-2xl">Tap to Start</div>
          <div className="mt-2 text-xs text-white">
            Autoplay 정책 대응을 위해 시작 버튼이 필요합니다
          </div>
        </button>
      )}

      <audio
        ref={audioRef}
        src={bgmSrc}
        loop
        crossOrigin="anonymous"
        onError={() =>
          setBgmError(
            "BGM 파일이 없습니다. public/audio/bgm.mp3 또는 온라인 소스를 지정하세요."
          )
        }
      />

      {bgmError && (
        <div className="absolute right-6 bottom-24 z-40 rounded-xl border border-white/20 bg-black/70 px-4 py-2 text-xs text-white">
          {bgmError}
        </div>
      )}
    </div>
  );
}
