// hooks/useLiveVitals.ts
/**
 * useLiveVitals — simulates a per-patient WebSocket subscription.
 * In production: replace the setInterval simulation with a real
 * WebSocket connection to the Alert & Escalation Engine.
 */
import { useEffect, useRef, useState } from 'react';
import type { Patient } from '../types/patient';

function rand(min: number, max: number) { return Math.random() * (max - min) + min; }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

export function useLiveVitals(patient: Patient, intervalMs = 2200) {
  const [p, setP] = useState<Patient>(patient);
  const ref = useRef(patient);

  useEffect(() => {
    ref.current = patient;
  }, [patient]);

  useEffect(() => {
    const id = setInterval(() => {
      setP(prev => {
        const v = { ...prev.vitals };
        v.hr   = clamp(v.hr   + rand(-2.2, 2.2), 38, 168);
        v.spo2 = clamp(v.spo2 + rand(-0.4, 0.4), 78, 100);
        v.sbp  = clamp(v.sbp  + rand(-2.2, 2.2), 62, 195);
        v.dbp  = clamp(v.dbp  + rand(-1.4, 1.4), 38, 125);
        v.rr   = clamp(v.rr   + rand(-0.7, 0.7), 7, 36);
        v.temp = clamp(v.temp + rand(-0.06, 0.06), 34.5, 40.2);
        const history = { ...prev.history };
        (['hr','spo2','sbp','rr','temp'] as const).forEach(k => {
          history[k] = [...history[k], v[k]].slice(-40);
        });
        const mlScore = clamp(prev.mlScore + (Math.random() < 0.3 ? (Math.random() < 0.5 ? 1 : -1) : 0), 0, 100);
        return { ...prev, vitals: v, history, mlScore, lastUpdate: Date.now() };
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return p;
}
