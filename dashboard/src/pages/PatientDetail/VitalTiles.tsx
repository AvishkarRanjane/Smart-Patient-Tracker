// pages/PatientDetail/VitalTiles.tsx
import type { Patient } from '../../types/patient';
import { vitalTileStatus } from '../../utils/vitalStatus';
import { fmt1 } from '../../utils/formatters';
import { VITAL_LABELS, VITAL_UNITS, VITAL_RANGES, VITAL_LOINC } from '../../utils/constants';
import styles from './detail.module.css';

const VITAL_KEYS = ['hr', 'spo2', 'sbp', 'rr', 'temp'];

interface Props { patient: Patient; selected: string; onSelect: (k: string) => void; }

export default function VitalTiles({ patient, selected, onSelect }: Props) {
  const v = patient.vitals;
  const vals: Record<string, string> = {
    hr:   String(fmt1(v.hr)),
    spo2: String(fmt1(v.spo2)),
    sbp:  String(Math.round(v.sbp)),
    rr:   String(fmt1(v.rr)),
    temp: String(fmt1(v.temp)),
  };

  return (
    <div className={styles.tiles}>
      {VITAL_KEYS.map(k => {
        const st = vitalTileStatus(k, v);
        return (
          <div
            key={k}
            className={`${styles.tile} glass ${selected === k ? styles.selected : ''}`}
            onClick={() => onSelect(k)}
          >
            <div className={styles.tileLabel}>{VITAL_LABELS[k]}</div>
            <div className={styles.tileLoinc}>{VITAL_LOINC[k]}</div>
            <div className={styles.tileValue}>
              {vals[k]}<span className={styles.tileUnit}> {VITAL_UNITS[k]}</span>
            </div>
            <div className={styles.tileRange}>{VITAL_RANGES[k]}</div>
            <div className={`${styles.tileBar} ${styles[st]}`}></div>
          </div>
        );
      })}
    </div>
  );
}
