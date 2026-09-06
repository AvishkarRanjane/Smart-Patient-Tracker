// utils/formatters.ts

/** Round to 1 decimal place */
export function fmt1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Human-readable elapsed time */
export function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 5)  return 'just now';
  if (s < 60) return `${s}s ago`;
  return `${Math.floor(s / 60)}m ago`;
}

/** HH:MM:SS uptime from a start epoch */
export function uptimeStr(startTime: number): string {
  const s   = Math.floor((Date.now() - startTime) / 1000);
  const h   = Math.floor(s / 3600);
  const m   = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map(n => String(n).padStart(2, '0')).join(':');
}

/** Zero-pad a number for display */
export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}
