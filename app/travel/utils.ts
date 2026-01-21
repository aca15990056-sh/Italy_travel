export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const total = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
