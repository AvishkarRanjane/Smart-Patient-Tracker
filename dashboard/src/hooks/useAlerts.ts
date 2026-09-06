// hooks/useAlerts.ts
import { useEffect, useRef } from 'react';
import type { Patient } from '../types/patient';
import type { Alert } from '../types/alert';
import { vitalStatus } from '../utils/vitalStatus';
import { fmt1 } from '../utils/formatters';
import { useAlertContext } from '../context/AlertContext';

let alertIdSeq = 1;
const lastAlertAt: Record<string, number> = {};
const COOLDOWN_MS = 14000;

export function useAlerts(patients: Patient[]) {
  const { addAlert } = useAlertContext();
  const patientsRef = useRef(patients);

  useEffect(() => { patientsRef.current = patients; }, [patients]);

  useEffect(() => {
    const id = setInterval(() => {
      patientsRef.current.forEach(p => {
        const st = vitalStatus(p.vitals);
        if (st === 'stable') return;
        if (Math.random() > 0.3) return;

        const key = `${p.id}-${st}`;
        if (lastAlertAt[key] && Date.now() - lastAlertAt[key] < COOLDOWN_MS) return;
        lastAlertAt[key] = Date.now();

        const v = p.vitals;
        let cause = `Heart rate ${fmt1(v.hr)} bpm`;
        if (v.spo2 < 90)  cause = `SpO₂ dropped to ${fmt1(v.spo2)}%`;
        else if (v.sbp > 150) cause = `Systolic BP ${fmt1(v.sbp)} mmHg`;
        else if (v.temp > 38.4) cause = `Temperature ${fmt1(v.temp)}°C`;
        else if (v.rr > 26)  cause = `Resp. rate ${fmt1(v.rr)}/min`;

        const isCrit = st === 'critical';
        const a: Alert = {
          id: alertIdSeq++,
          patientId: p.id,
          severity:  isCrit ? 'critical' : 'watch',
          text:      `${p.name} — ${cause}`,
          sub:       `Bed ${p.bed} · ${isCrit ? 'Critical threshold breached' : 'Trending outside normal range'} · Deterministic rule`,
          time:      Date.now(),
          acked:     false,
          escalation: isCrit ? 'tier2' : 'tier1',
          auditId:   'ALT-' + String(alertIdSeq).padStart(5, '0'),
        };
        addAlert(a);
      });
    }, 2500);
    return () => clearInterval(id);
  }, [addAlert]);
}
