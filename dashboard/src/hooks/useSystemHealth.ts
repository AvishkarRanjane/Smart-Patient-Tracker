// hooks/useSystemHealth.ts
/**
 * useSystemHealth — monitors the synthetic canary / dead-man's-switch.
 * In production: subscribes to the canary health-check WebSocket feed.
 * If the canary RTT exceeds a threshold, the topbar pill turns alert.
 */
import { useState, useEffect } from 'react';

export interface SystemHealth {
  canaryRtt:   number;  // ms
  canaryP95:   number;  // ms
  pipelineUp:  boolean;
  uptimePct:   string;
  lastCheckAt: number;
}

function rand(min: number, max: number) { return Math.random() * (max - min) + min; }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

export function useSystemHealth(): SystemHealth {
  const [rtt, setRtt]   = useState(847);
  const [p95, setP95]   = useState(1200);
  const [lastAt, setAt] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setRtt(prev => clamp(prev + rand(-60, 60), 280, 2400));
      setP95(prev => clamp(prev + rand(-80, 80), 400, 3200));
      setAt(Date.now());
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return {
    canaryRtt:  Math.round(rtt),
    canaryP95:  Math.round(p95),
    pipelineUp: rtt < 2000,
    uptimePct:  '99.97%',
    lastCheckAt: lastAt,
  };
}
