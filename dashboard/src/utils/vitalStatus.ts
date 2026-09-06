// utils/vitalStatus.ts
import type { Vitals } from '../types/patient';
import type { Thresholds } from '../types/threshold';
import { DEFAULT_THRESHOLDS } from './constants';

export type StatusColor = 'stable' | 'watch' | 'critical';

/** Overall patient status from all vitals */
export function vitalStatus(v: Vitals, t: Thresholds = DEFAULT_THRESHOLDS): StatusColor {
  const crit =
    v.spo2 < t.spo2Min - 3 ||
    v.hr   < t.hrLow - 8   ||
    v.hr   > t.hrHigh + 12 ||
    v.sbp  > t.sbpHigh + 20 ||
    v.temp > t.tempHigh + 0.8 ||
    v.rr   > t.rrHigh + 6;
  if (crit) return 'critical';

  const watch =
    v.spo2 < t.spo2Min ||
    v.hr   < t.hrLow   ||
    v.hr   > t.hrHigh  ||
    v.sbp  > t.sbpHigh ||
    v.temp > t.tempHigh ||
    v.rr   > t.rrHigh;
  return watch ? 'watch' : 'stable';
}

/** Per-tile status for a single vital */
export function vitalTileStatus(key: string, v: Vitals, t: Thresholds = DEFAULT_THRESHOLDS): StatusColor {
  switch (key) {
    case 'hr':
      if (v.hr < t.hrLow - 8  || v.hr > t.hrHigh + 12) return 'critical';
      if (v.hr < t.hrLow       || v.hr > t.hrHigh)       return 'watch';
      return 'stable';
    case 'spo2':
      if (v.spo2 < t.spo2Min - 3) return 'critical';
      if (v.spo2 < t.spo2Min)      return 'watch';
      return 'stable';
    case 'sbp':
      if (v.sbp > t.sbpHigh + 20) return 'critical';
      if (v.sbp > t.sbpHigh)       return 'watch';
      return 'stable';
    case 'rr':
      if (v.rr > t.rrHigh + 6) return 'critical';
      if (v.rr > t.rrHigh)      return 'watch';
      return 'stable';
    case 'temp':
      if (v.temp > t.tempHigh + 0.8) return 'critical';
      if (v.temp > t.tempHigh)        return 'watch';
      return 'stable';
    default:
      return 'stable';
  }
}

/** ML score → human label + CSS class modifier */
export function mlScoreLabel(score: number): { label: string; cls: string } {
  if (score > 60) return { label: 'High risk',  cls: 'high' };
  if (score > 30) return { label: 'Elevated',   cls: 'elevated' };
  return                  { label: 'Low risk',   cls: '' };
}
